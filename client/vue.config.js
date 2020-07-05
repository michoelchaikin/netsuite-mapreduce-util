const vueConfig = {}

vueConfig.chainWebpack = config => {
	// disable whitespace trimming because it breaks indenting in vue-json-tree, see:
	// * https://github.com/myst729/vue-json-tree/issues/6
	// * https://github.com/vuejs/vue/issues/10485#issuecomment-528729861
	config.module
		.rule('vue')
		.use('vue-loader')
		.tap(args => {
			args.compilerOptions.whitespace = 'preserve';
		})

	if (process.env.NODE_ENV === 'production') {
		config.plugin('html').init((Plugin, args) => {
			const newArgs = {
				...args[0]
			}
			newArgs.minify.removeAttributeQuotes = false
			return new Plugin(newArgs)
		})
	}
}

if (process.env.NODE_ENV !== 'production')
	vueConfig.devServer = {
		proxy: `https://${process.env.VUE_APP_NS_ACCOUNT_ID.replace('_', '-').toLowerCase()}.restlets.api.netsuite.com`
	}

vueConfig.transpileDependencies = ['vuetify']

module.exports = vueConfig
