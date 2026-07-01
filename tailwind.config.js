module.exports = {
  theme: {
    extend: {
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        }
      },
      animation: {
        slideUp: 'slideUp 0.25s ease-out forwards',
      }
    },
  },
}