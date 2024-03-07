module.exports = {
  apps: [
    {
      name: 'cryptomi_bot_client',
      script: 'npm',
      args: 'run build',
      interpreter: 'none',
    },
    {
      name: 'cryptomi_bot_server',
      script: 'server/index.js',
      args: '--port 3005',
      watch: true,
    }
  ]
}
