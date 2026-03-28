/**
 * OneBot 11 消息解析
 *
 * post_type:
 *   message   — 聊天消息（私聊/群聊）
 *   notice    — 系统通知（撤回、群成员变动、好友添加成功、文件上传等）
 *   request   — 请求（加好友、加群）
 *   meta_event — 心跳/生命周期（通常忽略）
 */

function parseMessage(msg) {
  switch (msg.post_type) {
    case "message":
      return parseChatMessage(msg);
    case "notice":
      return parseNotice(msg);
    case "request":
      return parseRequest(msg);
    default:
      return null;
  }
}

function parseChatMessage(msg) {
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
    postType: "message",
    channel: msg.message_type, // 'private' | 'group'
    contentType,
    userId: msg.user_id,
    nickname: msg.sender?.nickname || "未知用户",
    rawMessage: msg.raw_message,
    time: new Date(msg.time * 1000),
  };

  if (msg.message_type === "group") {
    base.groupId = msg.group_id;
    base.groupName = msg.group_name || "";
    base.role = msg.sender?.role || "member";
  }

  return base;
}

function parseNotice(msg) {
  // notice_type 常见值：
  //   group_recall       — 群消息撤回
  //   friend_recall      — 好友消息撤回
  //   group_increase     — 群成员增加
  //   group_decrease     — 群成员减少
  //   group_ban          — 群禁言
  //   friend_add         — 好友添加成功
  //   group_upload       — 群文件上传
  //   group_admin        — 群管理员变动
  //   notify             — 其他通知（戳一戳等），细分看 sub_type
  return {
    postType: "notice",
    noticeType: msg.notice_type,
    subType: msg.sub_type || null,
    userId: msg.user_id,
    groupId: msg.group_id || null,
    time: new Date(msg.time * 1000),
    raw: msg,
  };
}

function parseRequest(msg) {
  // request_type:
  //   friend — 加好友请求，comment 为验证消息，flag 用于同意/拒绝
  //   group  — 加群请求/邀请，sub_type 为 add(申请) 或 invite(邀请)
  return {
    postType: "request",
    requestType: msg.request_type, // 'friend' | 'group'
    subType: msg.sub_type || null,
    userId: msg.user_id,
    groupId: msg.group_id || null,
    comment: msg.comment || "",
    flag: msg.flag,
    time: new Date(msg.time * 1000),
  };
}

module.exports = { parseMessage };
