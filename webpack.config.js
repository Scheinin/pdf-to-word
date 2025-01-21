const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './src/index.ts',
	optimization: {
		splitChunks: {
			chunks: 'all', // 将所有模块进行分割
		},
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './index.html',
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs',
					to: 'pdf.worker.min.js',
				},
			],
		}),
	],
	devServer: {
		static: {
			directory: path.join(__dirname, 'dist'),
		},
		open: true,
		port: 8080,
	},
};
