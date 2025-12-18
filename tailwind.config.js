/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#300A24',        // Púrpura oscuro de Ubuntu
          text: '#FFFFFF',      // Blanco puro para texto
          prompt: '#8AE234',    // Verde Ubuntu para el prompt
          error: '#EF2929',     // Rojo Ubuntu
          success: '#4E9A06',   // Verde oscuro Ubuntu
          warning: '#FCE94F',   // Amarillo Ubuntu
          accent: '#E95420',    // Naranja característico de Ubuntu
        }
      },
      fontFamily: {
        mono: ['Ubuntu Mono', 'Monospace', 'Courier New', 'monospace'],
      },
      animation: {
        'cursor-blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
