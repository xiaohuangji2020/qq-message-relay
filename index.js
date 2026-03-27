const WebSocket = require("ws");

// 这里的端口 4000 对应你 docker run 时的 -p 4000:3000
const url = "ws://localhost:4000";

const ws = new WebSocket(url);

ws.on("open", () => {
  console.log("✅ 已成功连接到 NapCatQQ，开始截取实时消息...");
});

ws.on("message", (data) => {
  try {
    const msg = JSON.parse(data);

    // OneBot 11 协议中，post_type 为 message 代表是聊天消息
    if (msg.post_type === "message") {
      const time = new Date().toLocaleString();
      const sender = msg.sender.nickname || "未知用户";
      const content = msg.raw_message; // 包含 CQ 码的消息内容

      if (msg.message_type === "group") {
        // 群消息
        console.log(`\n[${time}] 👥 群聊(${msg.group_id})`);
        console.log(`${sender}(${msg.user_id}): ${content}`);
      } else if (msg.message_type === "private") {
        // 私聊消息
        console.log(`\n[${time}] 👤 私聊`);
        console.log(`${sender}(${msg.user_id}): ${content}`);
      }
    }
  } catch (e) {
    // 忽略非 JSON 格式或解析错误的数据
  }
});

ws.on("error", (err) => {
  console.error("❌ 连接错误:", err.message);
});

ws.on("close", () => {
  console.log("🔌 与 NapCatQQ 的连接已断开。");
});
