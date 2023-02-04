import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import checker from 'vite-plugin-checker'
import { ViteCspPlugin } from 'vite-plugin-csp';
import replace from '@rollup/plugin-replace';
import visualizer from 'rollup-plugin-visualizer'

const path = require("path");
export default defineConfig({
    treeshake: "smallest",
    build: {
        rollupOptions: {
            plugins: [
                visualizer(),
            ]
        }
    },
    plugins: [
        replace({
            __SENTRY_DEBUG__: false,
            preventAssignment: true
        },),
        vue(),
        checker({
            typescript: true,
        }),
        ViteCspPlugin({
            'script-src': ["'self'", "https://challenges.cloudflare.com"],
            'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
            'object-src': ["'none'"],
        }, {
            inject: true,
            enabled: process.env.VERCEL_ENV !== 'development',
            hashEnabled: {
                'style-src': false,
                'script-src': true,
            },
            nonceEnabled: {
                'style-src': false,
                'script-src': true,
            },
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});