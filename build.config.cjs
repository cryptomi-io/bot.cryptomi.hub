module.exports = {
  apps: [
    {
      name: 'hub.cryptomi.client',
      script: 'yarn run vite build',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      }
    },
    {
      name: 'hub.cryptomi.server',
      script: 'node ./dist/index.js',
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
