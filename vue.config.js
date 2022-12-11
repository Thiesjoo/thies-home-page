const EXTRA_KEYS = ["AUTHBASEURL", "DEVICEBASEURL"]
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');


module.exports = {
    configureWebpack: {
        plugins: [new CspHtmlWebpackPlugin({
            'script-src': ["'self'", "https://static.cloudflareinsights.com", "https://challenges.cloudflare.com", "https://www.google.com/"],
            'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
            'object-src': ["'none'"],
        }, {
            enabled: process.env.NODE_ENV === 'production',
            hashEnabled: {
                'style-src': false,
                'script-src': true,
            },
            nonceEnabled: {
                'style-src': false,
                'script-src': true,
            },
        })],
    },
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