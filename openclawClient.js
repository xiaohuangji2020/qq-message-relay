const https = require('https');
const http = require('http');

const OPENCLAW_URL = process.env.OPENCLAW_URL || 'http://localhost:21234/v1/chat/completions';
const OPENCLAW_TOKEN = process.env.OPENCLAW_TOKEN;
const OPENCLAW_MODEL = process.env.OPENCLAW_MODEL || 'openclaw/cyan_clone';

/**
 * 发送消息给 OpenClaw，返回回复文本
 * @param {string} text 用户消息文本
 * @param {string} sessionKey 会话 key，格式 agent:cyan_clone:<group|user>:<id>
 * @returns {Promise<string>} 回复内容
 */
function askOpenclaw(text, sessionKey) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: OPENCLAW_MODEL,
      messages: [{ role: 'user', content: text }],
    });

    const url = new URL(OPENCLAW_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENCLAW_TOKEN}`,
        'x-openclaw-session-key': sessionKey,
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const transport = url.protocol === 'https:' ? https : http;
    const req = transport.request(options, (res) => {
      let raw = '';
      res.on('data', (chunk) => { raw += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(raw);
          const content = json.choices?.[0]?.message?.content;
          if (!content) {
            reject(new Error('OpenClaw 返回内容为空: ' + raw));
          } else {
            resolve(content);
          }
        } catch (e) {
          reject(new Error('解析 OpenClaw 响应失败: ' + e.message));
        }
      });
    });

    req.on('error', (e) => reject(new Error('OpenClaw 请求错误: ' + e.message)));
    req.write(body);
    req.end();
  });
}

module.exports = { askOpenclaw };
