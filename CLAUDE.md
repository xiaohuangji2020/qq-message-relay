# qq-message-relay

## 项目概述

通过 NapCatQQ 的 WebSocket 接口（OneBot 11 协议）实时截取 QQ 消息。

## 项目结构

```
index.js        # 主入口，WebSocket 客户端
package.json    # 依赖（仅 ws）
```

## 运行方式

NapCatQQ 需通过 Docker 运行，将容器内 3000 端口映射到本机 4000 端口：

```bash
node index.js
```

## OneBot 11 协议关键字段

- `msg.post_type === "message"` — 聊天消息事件
- `msg.message_type` — `"group"` 或 `"private"`
- `msg.group_id` — 群号
- `msg.user_id` — 发送者 QQ 号
- `msg.sender.nickname` — 昵称
- `msg.raw_message` — 原始消息内容（含 CQ 码）

## 已知问题 / TODO

- Token 硬编码在 index.js，应改用环境变量
- 连接断开后无自动重连
- catch 块静默忽略所有错误
