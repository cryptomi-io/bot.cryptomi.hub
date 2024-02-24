module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          VUE_APP_API_KEY: JSON.stringify(process.env.VUE_APP_API_KEY)
        }
      })
    ]
  }
}