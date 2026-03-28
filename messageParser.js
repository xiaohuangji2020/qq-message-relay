/**
 * 消息类型解析
 *
 * channel: 'private' | 'group'
 * contentType: 'text' | 'image' | 'face' | 'mixed' | 'unknown'
 */

function parseMessage(msg) {
  if (msg.post_type !== "message") return null;

  const channel = msg.message_type; // 'private' | 'group'
  const types = (msg.message || []).map((seg) => seg.type);
  const uniqueTypes = [...new Set(types)];

  let contentType;
  if (uniqueTypes.length === 0) {
    contentType = "unknown";
  } else if (uniqueTypes.length === 1) {
    contentType = uniqueTypes[0]; // 'text' | 'image' | 'face' | ...
  } else {
    contentType = "mixed";
  }

  const base = {
    channel,
    contentType,
    userId: msg.user_id,
    nickname: msg.sender?.nickname || "未知用户",
    rawMessage: msg.raw_message,
    time: new Date(msg.time * 1000),
  };

  if (channel === "group") {
    base.groupId = msg.group_id;
    base.groupName = msg.group_name || "";
    base.role = msg.sender?.role || "member";
  }

  return base;
}

module.exports = { parseMessage };
