module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',  // Đảm bảo rằng Tailwind CSS biết nơi tìm các tệp của bạn
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
