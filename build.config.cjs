module.exports = {
  apps: [
    {
      name: 'hub.cryptomi.server',
      script: 'node ./server/index.js',
      // watch: ['./dist'],
      // ignore_watch: ['node_modules'],
      env: {
        NODE_ENV: 'development',
        PORT: 4005
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4005
      }
    }
  ]
}
