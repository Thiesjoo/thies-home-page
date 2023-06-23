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
        // Sentry optimilzation
        replace({
            __SENTRY_DEBUG__: false,
            preventAssignment: true
        },),
        // Vue
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => tag.startsWith('passage-'),
                }
            }
        }),
        // Typescript checker
        checker({
            typescript: true,
        }),
        // CSP
        ViteCspPlugin({
            'script-src': ["'self'", "'unsafe-eval'"],
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
    // Cool typescript aliases
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js'
        },
    }
});
