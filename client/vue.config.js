const vueConfig = {}

if (process.env.NODE_ENV === 'production') {
	vueConfig.chainWebpack = (config) => {
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
