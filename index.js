const WebSocket = require("ws");

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

    if (msg.post_type === "message") {
      const time = new Date().toLocaleString();
      const sender = msg.sender.nickname || "未知用户";
      const content = msg.raw_message;

      console.log('msg', msg)
      if (msg.message_type === "group") {
        console.log(`\n[${time}] 👥 群聊(${msg.group_id})`);
        console.log(`${sender}(${msg.user_id}): ${content}`);
      } else if (msg.message_type === "private") {
        console.log(`\n[${time}] 👤 私聊`);
        console.log(`${sender}(${msg.user_id}): ${content}`);
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
