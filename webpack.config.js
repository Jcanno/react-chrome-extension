/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const outputPath = path.resolve(__dirname, 'dist')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const WebpackBar = require('webpackbar')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const isDev = process.env.NODE_ENV === 'development'
// 只需要复制的文件
const copyFiles = [
  {
    from: path.resolve('src/manifest.json'),
    to: `${path.resolve('dist')}`,
  },
  {
    from: path.resolve('assets'),
    to: path.resolve('dist/assets'),
  },
]

const packDirs = [
  { entry: 'popup/index.tsx', output: 'popup/index' },
  { entry: 'devtools/index.tsx', output: 'devtools/index' },
  { entry: 'inject/index.ts', output: 'inject/index' },
  { entry: 'content/index.tsx', output: 'content/index' },
  {
    entry: isDev ? 'background/index-dev.ts' : 'background/index.ts',
    output: 'background/index',
  },
  { entry: 'devtools/panel.tsx', output: 'devtools/panel' },
]
const entry = packDirs.reduce((obj, item) => {
  obj[item.output] = `./src/${item.entry}`
  return obj
}, {})

const pages = ['popup', 'devtools', 'devtools/panel.html'].map((page) => {
  const isFullPath = page.includes('.html')
  const filename = isFullPath ? page : `${page}/index.html`
  const template = isFullPath ? `src/${page}` : `src/${page}/index.html`
  const chunks = isFullPath ? [page.slice(0, page.indexOf('.'))] : [`${page}/index`]

  return new HtmlWebpackPlugin({
    filename,
    template,
    chunks,
  })
})

module.exports = {
  mode: 'production',
  entry,
  output: {
    path: outputPath,
    filename: '[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|svg|ttf|eot|woff|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'assets/[name].[hash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
      },
    ],
  },
  plugins: [
    ...pages,
    new CopyWebpackPlugin({
      patterns: copyFiles,
    }),
    new WebpackBar(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash:8].css',
      chunkFilename: 'css/[name].[chunkhash:8].css',
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
}
