module.exports = {
  chainWebpack: config => {
    config.plugin('define').tap(([options = {}]) => {
      return [{
        ...options, // these are the env variables from your .env file, if any arr defined
        ENV:
          JSON.stringify(Object.keys(process.env)
            .filter(key => key.startsWith("VUE_APP_"))
            .reduce((obj, key) => {
              obj[key] = process.env[key];
              return obj;
            }, {}))
      }]
    })
  }
}