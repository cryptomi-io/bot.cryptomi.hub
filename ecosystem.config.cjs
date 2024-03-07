module.exports = {
  apps: [
    {
      name: 'vite',
      script: 'vite',
      args: '--port 3000',
      interpreter: 'none',
      watch: true,
    },
    {
      name: 'server',
      script: 'server/index.js',
      args: '--port 3005',
      watch: true,
    }
  ]
}
