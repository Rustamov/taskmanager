const path = require(`path`);
const MomentLocalesPlugin = require(`moment-locales-webpack-plugin`);

module.exports = {
  mode: `development`, //Режим сборки
  entry: `./src/main.js`, // Точка входя для приложения
  output: { // Настрока для выходного файла
    filename: `bundle.js`,
    path: path.join(__dirname, `public`)
  },
  devtool: `source-map`, // Подключаем source-map
  devServer: {
    static: path.join(__dirname, `public`), // Где искать сборку
    // Автоматическая перезагрузка страницы
    // По умолчанию приложение будет доступно по адресу http://localhost:8080
    // Лучше открывать в режиме инкогнито, чтобы брузер не кэшировал файл сборки
    // watchContentBase: true
  },
  module: {
    rules: [
        // {
        //   test: /\.js$/,
        //   exclude: /(node_modules)/,
        //   use: ['babel-loader']
        // },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        }
    ]
  },
  plugins: [
    new MomentLocalesPlugin({
      localesToKeep: [`es-us`],
    })
  ]
}
