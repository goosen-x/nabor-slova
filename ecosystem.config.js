module.exports = {
  apps: [{
    name: 'nabor-slova',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/nabor-slova', // Измените на ваш путь на сервере
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/nabor-slova-error.log',
    out_file: '/var/log/pm2/nabor-slova-out.log',
    log_file: '/var/log/pm2/nabor-slova-combined.log',
    time: true,
    max_memory_restart: '1G',
    autorestart: true,
    watch: false,
    ignore_watch: ["node_modules", ".next", "logs"],
    max_restarts: 10,
    min_uptime: '10s'
  }]
}