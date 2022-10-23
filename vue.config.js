const EXTRA_KEYS = ["BASEURL"]
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');


module.exports = {
  configureWebpack: {
    plugins: [new CspHtmlWebpackPlugin({
      'script-src': ["'self'", "https://static.cloudflareinsights.com", "https://challenges.cloudflare.com", "https://www.google.com/"],
      'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    }, {
      enabled: process.env.NODE_ENV === 'production',
    })],
  },
  chainWebpack: config => {
    // config.plugin("html").tap(([options]) => {
    //   console.log('test', options)

    //   return [{
    //     ...options,
    //     cspPlugin: {
    //       enabled: true,
    //       // enabled: modeArgument === 'production',
    //       hashEnabled: {
    //         'script-src': true,
    //         'style-src': false,
    //       },
    //       nonceEnabled: {
    //         'script-src': true,
    //         'style-src': false,
    //       },
    //       policy: {
    //         'base-uri': "'self'",
    //         'default-src': "'self'",
    //         'frame-src': "'none'",
    //         'img-src': ["'self'", 'data:'],
    //         'media-src': "'none'",
    //         'object-src': "'none'",
    //         'script-src': ["'self'"],
    //         'style-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    //       },
    //     },
    //   }]
    // })
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