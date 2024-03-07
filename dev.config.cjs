module.exports = {
  apps: [
    {
      name: 'cryptomi_bot_client',
      script: 'vite',
      args: '--port 3000',
      interpreter: 'none',
      watch: true,
    },
    {
      name: 'cryptomi_bot_server',
      script: 'server/index.js',
      args: '--port 3005',
      watch: true,
    }
  ]
}
