const WebSocket = require("ws");
const { parseMessage } = require("./messageParser");

// 配置项：通过环境变量注入，也可保留默认值
const url = process.env.NAPCAT_WS_URL || "ws://localhost:4000";
const token = process.env.NAPCAT_TOKEN;

if (!token) {
  console.error("❌ 未设置 NAPCAT_TOKEN 环境变量");
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
    console.log("✅ 已成功连接到 NapCatQQ，开始截取实时消息...");
  });

  ws.on("message", (data) => {
    let msg;
    try {
      msg = JSON.parse(data);
    } catch (e) {
      console.error("⚠️ 收到无法解析的数据:", e.message);
      return;
    }
    const parsed = parseMessage(msg);
    if (!parsed) return;

    const time = parsed.time.toLocaleString();

    if (parsed.postType === "message") {
      const { channel, contentType, nickname, userId, rawMessage } = parsed;
      if (channel === "group") {
        console.log(`\n[${time}] 👥 群聊(${parsed.groupId}) [${contentType}]`);
        console.log(`${nickname}(${userId}): ${rawMessage}`);
      } else if (channel === "private") {
        console.log(`\n[${time}] 👤 私聊 [${contentType}]`);
        console.log(`${nickname}(${userId}): ${rawMessage}`);
      }
    } else if (parsed.postType === "notice") {
      const { noticeType, subType, userId, groupId } = parsed;
      const suffix = subType ? `/${subType}` : "";
      const scope = groupId ? `群(${groupId}) ` : "";
      console.log(`\n[${time}] 🔔 通知 ${scope}[${noticeType}${suffix}] user=${userId}`);
    } else if (parsed.postType === "request") {
      const { requestType, subType, userId, groupId, comment } = parsed;
      if (requestType === "friend") {
        console.log(`\n[${time}] 🤝 加好友请求 user=${userId} 验证: ${comment}`);
      } else if (requestType === "group") {
        const action = subType === "invite" ? "邀请入群" : "申请入群";
        console.log(`\n[${time}] 🚪 ${action} 群(${groupId}) user=${userId} 验证: ${comment}`);
      }
    }
  });

  ws.on("error", (err) => {
    console.error("❌ 连接错误:", err.message);
  });

  ws.on("close", () => {
    console.log(`🔌 连接已断开，${RECONNECT_DELAY_MS / 1000} 秒后重连...`);
    setTimeout(connect, RECONNECT_DELAY_MS);
  });
}

connect();
