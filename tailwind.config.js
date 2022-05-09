module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /bg-(.*)-(600|400)/,
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