module.exports = {
  apps : [{
    name: "qq-message-relay",
    script: "npm",
    args: "run start",
    watch: false, // 如果是生产环境，建议关闭监听
    env: {
      NODE_ENV: "production",
    },
    // 自动重启配置
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: "YYYY-MM-DD HH:mm:ss"
  }]
}