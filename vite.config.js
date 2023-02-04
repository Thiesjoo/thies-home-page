import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import checker from 'vite-plugin-checker'

// https://vitejs.dev/config/
const path = require("path");
export default defineConfig({
    plugins: [
        vue(),
        // checker({
        //     typescript: true,
        // }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    // root: "src",
    // build: {
    //     outDir: '../dist'
    // }
});
