// 好友私聊消息
const msg1 = {
  self_id: 3570343501,
  user_id: 905679510,
  time: 1774713654,
  message_id: 1366231521,
  message_seq: 1366231521,
  real_id: 1366231521,
  real_seq: '13',
  message_type: 'private',
  sender: { user_id: 905679510, nickname: '花期渐远断流年', card: '' },
  raw_message: '66',
  font: 14,
  sub_type: 'friend',
  message: [ { type: 'text', data: [Object] } ],
  message_format: 'array',
  post_type: 'message',
  target_id: 905679510
}

// 群聊消息
const msg2 = {
  self_id: 3570343501,
  user_id: 905679510,
  time: 1774713676,
  message_id: 1920645830,
  message_seq: 1920645830,
  real_id: 1920645830,
  real_seq: '12',
  message_type: 'group',
  sender: { user_id: 905679510, nickname: '花期渐远断流年', card: '', role: 'owner' }, // role还可能是member
  raw_message: 'k',
  font: 14,
  sub_type: 'normal',
  message: [ { type: 'text', data: [Object] } ],
  message_format: 'array',
  post_type: 'message',
  group_id: 214312749,
  group_name: '心，我的愿'
}

// 添加好友成功消息
const msg4 = {
  self_id: 3570343501,
  user_id: 363514302,
  time: 1774713878,
  message_id: 271179310,
  message_seq: 271179310,
  real_id: 271179310,
  real_seq: '2',
  message_type: 'private',
  sender: { user_id: 363514302, nickname: '涂山澄澄', card: '' },
  raw_message: '请求添加你为好友',
  font: 14,
  sub_type: 'friend',
  message: [ { type: 'text', data: [Object] } ],
  message_format: 'array',
  post_type: 'message',
  target_id: 363514302
}

// 私聊图片消息
const msg5 = {
  self_id: 3570343501,
  user_id: 363514302,
  time: 1774714264,
  message_id: 2143308560,
  message_seq: 2143308560,
  real_id: 2143308560,
  real_seq: '3',
  message_type: 'private',
  sender: { user_id: 363514302, nickname: '涂山澄澄', card: '' },
  raw_message: '[CQ:image,file=C76732454C601B8481BCAEAC5B7979E1.png,sub_type=0,url=https://multimedia.nt.qq.com.cn/download?appid=1406&amp;fileid=EhQSwnDOEWKaJMF8Dvewu9wxGJfohhiV_Rsg_gootfiO6v3CkwMyBHByb2RQgLsvWhC8Y0yzq-4xZYQFdEmt0G4degLFh4IBAm5q&amp;rkey=CAMSMOC8UpC94ZbMK1zZb2PQ85cSU9Pm6xPleHbHpgqyKmG-xW_MVNiQeK54fB-mi5QGCQ,file_size=458389]',
  font: 14,
  sub_type: 'friend',
  message: [ { type: 'image', data: [Object] } ],
  message_format: 'array',
  post_type: 'message',
  target_id: 363514302
}

// 私聊表情消息
const msg6 = {
  self_id: 3570343501,
  user_id: 363514302,
  time: 1774714343,
  message_id: 2075014619,
  message_seq: 2075014619,
  real_id: 2075014619,
  real_seq: '4',
  message_type: 'private',
  sender: { user_id: 363514302, nickname: '涂山澄澄', card: '' },
  raw_message: '[CQ:face,id=109,raw=&#91;object Object&#93;]',
  font: 14,
  sub_type: 'friend',
  message: [ { type: 'face', data: [Object] } ],
  message_format: 'array',
  post_type: 'message',
  target_id: 363514302
}

// 私聊表情+文字消息
const msg7 = {
  self_id: 3570343501,
  user_id: 363514302,
  time: 1774714385,
  message_id: 632029076,
  message_seq: 632029076,
  real_id: 632029076,
  real_seq: '6',
  message_type: 'private',
  sender: { user_id: 363514302, nickname: '涂山澄澄', card: '' },
  raw_message: '[CQ:face,id=20,raw=&#91;object Object&#93;][CQ:face,id=20,raw=&#91;object Object&#93;]啊很好的好的',
  font: 14,
  sub_type: 'friend',
  message: [
    { type: 'face', data: [Object] },
    { type: 'face', data: [Object] },
    { type: 'text', data: [Object] }
  ],
  message_format: 'array',
  post_type: 'message',
  target_id: 363514302
}

// 添加好友请求
const msg8 = {
  time: 1774717965,
  self_id: 3570343501,
  post_type: 'request',
  request_type: 'friend',
  user_id: 1557672359,
  comment: '我是篱音®碎风♂',
  flag: '1774717964'
}