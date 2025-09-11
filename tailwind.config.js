module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors:{
        'mi-color': '#123456',
      },
      fontFamily:{
        sans:['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
