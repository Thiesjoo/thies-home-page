module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /bg-(.*)-600/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}