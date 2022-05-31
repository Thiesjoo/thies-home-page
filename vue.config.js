const EXTRA_KEYS = ["BASEURL"]

module.exports = {
  transpileDependencies: ['vuex-module-decorators'],
  chainWebpack: config => {
    config.plugin('define').tap(([options = {}]) => {
      return [{
        ...options, // these are the env variables from your .env file, if any arr defined
        ENV:
          JSON.stringify(Object.keys(process.env)
            .filter(key => key.startsWith("VUE_APP_") || EXTRA_KEYS.includes(key))
            .reduce((obj, key) => {
              obj[key] = process.env[key];
              return obj;
            }, {}))
      }]
    })
  }
}