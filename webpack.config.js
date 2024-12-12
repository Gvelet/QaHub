const config = {
	mode: 'production',
	entry: {
		index: './src/js/index.js',
		// contacts: './src/js/contacts.js',
		// about: './src/js/about.js',
		// carousel: './node_modules/slick-carousel/slick/slick.js',
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
