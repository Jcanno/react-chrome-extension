const path = require('path');
const outputPath = path.resolve(__dirname, 'dist');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackBar = require('webpackbar')
const fs = require('fs')
const CopyWebpackPlugin = require("copy-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const TerserPlugin = require('terser-webpack-plugin')

// 只需要复制的文件
const copyFiles = [
  {
    from: path.resolve("src/manifest.json"),
    to: `${path.resolve("dist")}`
  },
  {
    from: path.resolve("assets"),
    to: path.resolve("dist/assets")
  },
];

const packDirs = ['popup', 'devtools', 'inject', 'content', 'background', 'devtools/panel.tsx']
const entry = packDirs.reduce((entry, dir) => {
	if(dir.includes('.')) {
		entry[dir.slice(0, dir.indexOf('.'))] = `./src/${dir}`
		return entry
	}
	const isTsx = fs.existsSync(`src/${dir}/index.tsx`)
	entry[`${dir}/index`] = `./src/${dir}/index.${isTsx ? 'tsx' : 'ts'}`
	return entry
}, {})

const pages = ['popup', 'devtools', 'devtools/panel.html'].map(page => {
	const isFullPath = page.includes('.html')
	const filename = isFullPath ? page : `${page}/index.html`
	const template = isFullPath ? `src/${page}` : `src/${page}/index.html`
	const chunks = isFullPath ? [page.slice(0, page.indexOf('.'))] : [`${page}/index`]

	return new HtmlWebpackPlugin({
		filename,
		template,
		chunks
	})
})

module.exports = {
	mode: 'production',
	entry,
	output: {
		path: outputPath,
		filename: '[name].js',
		publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: 'babel-loader',
				exclude: /node_modules/
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
							name: 'assets/[name].[hash:8].[ext]'
						}
					}
				]
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader',
					'postcss-loader'
				]
			},
			{
				test: /\.less$/,
				use: [
					'style-loader',
					'css-loader',
					'postcss-loader',
					'less-loader'
				]
			}
		]
	},
	plugins: [
		...pages,
		new CopyWebpackPlugin({
			patterns: copyFiles
		}),
		new WebpackBar(),
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: 'css/[name].[hash:8].css',
			chunkFilename: 'css/[name].[chunkhash:8].css'
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
  }
};
