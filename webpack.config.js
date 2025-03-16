const config = {
	mode: 'production',
	entry: {
		index: './src/js/index.js',
		allinstruments: './src/js/allinstruments.js',
		dataAnalysis: './src//js/dataAnalysis.js',
		photoResolution: './src/js/photoResolution.js',
		statusCode: './src/js/statusCode.js',
		characterCounting: './src/js/characterCounting.js',
		tests: './src/js/tests.js',
		test: './src/js/test.js',
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
