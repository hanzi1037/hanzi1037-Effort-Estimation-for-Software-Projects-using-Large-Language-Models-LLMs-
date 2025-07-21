/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6", // Blue-500
        input: "#D1D5DB", // Gray-300
        background: "#ffffff", // White
      },
      typography: (theme) => ({
        dark: {
          css: {
            color: theme('colors.gray.100'),
            h1: { color: theme('colors.white') },
            h2: { color: theme('colors.white') },
            h3: { color: theme('colors.white') },
            h4: { color: theme('colors.white') },
            strong: { color: theme('colors.white') },
            em: { color: theme('colors.white') },
            code: { color: theme('colors.white') },
            blockquote: {
              color: theme('colors.gray.100'),
              borderLeftColor: theme('colors.gray.700'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

