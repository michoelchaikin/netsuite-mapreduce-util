const vueConfig = {}

if (process.env.NODE_ENV === "production") {
  vueConfig.chainWebpack = (config) => {
    config.plugin("html").init((Plugin, args) => {
      const newArgs = {
        ...args[0],
      }
      newArgs.minify.removeAttributeQuotes = false
      return new Plugin(newArgs)
    })
  }
}
vueConfig.devServer = { proxy: "https://1678366.restlets.api.netsuite.com" }
vueConfig.transpileDependencies = ["vuetify"]

module.exports = vueConfig
