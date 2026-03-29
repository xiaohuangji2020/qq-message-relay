const logger = require('./logger');
const WebSocket = require("ws");
const { parseMessage } = require("./messageParser");
const { askOpenclaw } = require("./openclawClient");

// 配置项：通过环境变量注入，也可保留默认值
const url = process.env.NAPCAT_WS_URL || "ws://localhost:4000";
const token = process.env.NAPCAT_TOKEN;

if (!token) {
  logger.error("❌ 未设置 NAPCAT_TOKEN 环境变量");
  process.exit(1);
}

const RECONNECT_DELAY_MS = 5000;
let ws;

function connect() {
  ws = new WebSocket(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  ws.on("open", () => {
    logger.log("✅ 已成功连接到 NapCatQQ，开始截取实时消息...");
  });

  ws.on("message", (data) => {
    let msg;
    try {
      msg = JSON.parse(data);
    } catch (e) {
      logger.error("⚠️ 收到无法解析的数据:" + e.message);
      return;
    }
    const parsed = parseMessage(msg);
    if (!parsed) return;

    const time = parsed.time.toLocaleString();

    if (parsed.postType === "message") {
      const { channel, contentType, nickname, userId, rawMessage } = parsed;
      if (channel === "group") {
        logger.log(`\n[${time}] 👥 群聊(${parsed.groupId}) [${contentType}]`);
        logger.log(`${nickname}(${userId}): ${rawMessage}`);
      } else if (channel === "private") {
        logger.log(`\n[${time}] 👤 私聊 [${contentType}]`);
        logger.log(`${nickname}(${userId}): ${rawMessage}`);
      }
      if (rawMessage) {
        const sessionKey = channel === 'group'
          ? `agent:cyan_clone:qq:group:${parsed.groupId}`
          : `agent:cyan_clone:qq:user:${userId}`;
        askOpenclaw(rawMessage, sessionKey).then((reply) => {
          logger.log(`🤖 OpenClaw 回复: ${reply}`);
          if (channel === "private") {
            ws.send(JSON.stringify({
              action: "send_private_msg",
              params: { user_id: userId, message: reply },
            }));
          } else if (channel === "group") {
            ws.send(JSON.stringify({
              action: "send_group_msg",
              params: { group_id: parsed.groupId, message: reply },
            }));
          }
        }).catch((e) => {
          logger.error(`❌ OpenClaw 请求失败: ${e.message}`);
        });
      }
    } else if (parsed.postType === "notice") {
      const { noticeType, subType, userId, groupId } = parsed;
      const suffix = subType ? `/${subType}` : "";
      const scope = groupId ? `群(${groupId}) ` : "";
      logger.log(`\n[${time}] 🔔 通知 ${scope}[${noticeType}${suffix}] user=${userId}`);
    } else if (parsed.postType === "request") {
      const { requestType, subType, userId, groupId, comment, flag } = parsed;
      if (requestType === "friend") {
        logger.log(`\n[${time}] 🤝 加好友请求 user=${userId} 验证: ${comment}`);
        logger.log(`  ⏳ 将在 10 分钟后自动同意`);
        setTimeout(() => {
          ws.send(JSON.stringify({
            action: "set_friend_add_request",
            params: { flag, approve: true },
          }));
          logger.log(`✅ 已自动同意好友请求 user=${userId}`);
        }, 10 * 60 * 1000);
      } else if (requestType === "group") {
        const action = subType === "invite" ? "邀请入群" : "申请入群";
        logger.log(`\n[${time}] 🚪 ${action} 群(${groupId}) user=${userId} 验证: ${comment}`);
        logger.log(`  ⏳ 将在 10 分钟后自动同意`);
        setTimeout(() => {
          ws.send(JSON.stringify({
            action: "set_group_add_request",
            params: { flag, sub_type: subType, approve: true },
          }));
          logger.log(`✅ 已自动同意${action} 群(${groupId}) user=${userId}`);
        }, 10 * 60 * 1000);
      }
    }
  });

  ws.on("error", (err) => {
    logger.error("❌ 连接错误:" + err.message);
  });

  ws.on("close", () => {
    logger.log(`🔌 连接已断开，${RECONNECT_DELAY_MS / 1000} 秒后重连...`);
    setTimeout(connect, RECONNECT_DELAY_MS);
  });
}

connect();
