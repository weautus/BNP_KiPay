/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bnp: {
          dark:    '#001A0F',
          darker:  '#000F09',
          green:   '#00965E',
          mid:     '#006D3D',
          deep:    '#004D2B',
          teal:    '#007B6F',
          tealdark:'#004D45',
          light:   '#6DC074',
        }
      }
    }
  },
  plugins: []
}
