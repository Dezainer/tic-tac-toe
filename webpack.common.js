const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
	entry: ['./src/app.js'],
	resolve: {
		modules: [
			'node_modules',
			path.resolve(__dirname, 'assets'),
			path.resolve(__dirname, 'src/pages'),
			path.resolve(__dirname, 'src/components'),
			path.resolve(__dirname, 'src/style'),
			path.resolve(__dirname, 'src/core')
		],
		extensions: ['.js', '.css']
	},
	output: { 
		path: path.resolve(__dirname, 'public'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.js?$/,
				loader: 'babel-loader',
				options: {
					presets: ['env', 'stage-0', 'react']
				},
				exclude: path.resolve(__dirname, 'node_modules')
			},
			{ 
				test: /\.(ttf|eot)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '/fonts/[name].[ext]'
						}
					}
				]
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('styles.css')
	],
	devServer: {
		contentBase: path.join(__dirname, "public"),
		historyApiFallback: true,
		watchOptions: {
			poll: true
		}
	}
}