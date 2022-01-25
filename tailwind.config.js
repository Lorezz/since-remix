module.exports = {
  mode: 'jit',
  purge: ['./app/**/*.{ts,tsx,js,jsx}'],
  content: [],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
