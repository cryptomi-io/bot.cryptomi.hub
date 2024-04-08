import { CopyPlugin } from 'copy-webpack-plugin'
module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          VUE_APP_API_KEY: JSON.stringify(process.env.VUE_APP_API_KEY)
        }
      }),
      new CopyPlugin({
        patterns: [
          { from: "/public/.htaccess", to: "" }, // Указывайте корректный путь к .htaccess
    ]
  }
}