module.exports = {
    jit: true,
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    safelist: [
        {
            // Every base widget color
            pattern: /bg-(.*)-(600)/,
        },
        {
            // Battery colors 
            // remoteDevices: text - green, yellow, red, gray: -600
            // Widget: bg - green, yellow, red, gray: -600
            pattern: /(text|bg)-(green|yellow|red|gray)-(600)/,
        },
    ],
    theme: {
        extend: {},
    },
    plugins: [],
    corePlugins: {
        preflight: false
    }
}