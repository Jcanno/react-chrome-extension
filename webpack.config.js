const path = require('path');
const entryPath = path.resolve(__dirname, 'src/index.tsx');
const outputPath = path.resolve(__dirname, 'dist');
const htmlPath = path.resolve(__dirname, 'public/index.html');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackBar = require('webpackbar')

module.exports = {
	mode: 'production',
	entry: {
		app: entryPath
	},
	output: {
		path: outputPath,
		filename: 'js/[name].js',
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
		new WebpackBar(),
		new HtmlWebpackPlugin({
			template: htmlPath,
			filename: 'index.html',
			minify: true
		}),
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: 'css/[name].[hash:8].css',
			chunkFilename: 'css/[name].[chunkhash:8].css'
		}),
	],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  }
};
