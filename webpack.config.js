const config = {
	mode: 'production',
	entry: {
		index: './src/js/index.js',
		allinstruments: './src/js/allinstruments.js',
		dataAnalysis: './src//js/dataAnalysis.js',
		photoResolution: './src/js/photoResolution.js'
		// jQuery: './node_modules/jquery/dist/jquery.min.js'
	},
	output: {
		filename: '[name].bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
};

module.exports = config;
