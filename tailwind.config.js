module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /(bg|text)-(.*)-(600|400)/,
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