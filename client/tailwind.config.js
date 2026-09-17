/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Swiss Monochrome & Electric Orange Design System
        charcoal: {
          950: '#0B0C0E',
          900: '#121417', // Primary Charcoal Black anchor
          800: '#181A20',
          700: '#23262F',
          600: '#353945',
          500: '#555C68',
        },
        orange: {
          400: '#FF7A45',
          500: '#FF5A1F', // Vivid Electric Orange anchor
          600: '#E04812',
          700: '#B83508',
        },
        surface: {
          50: '#FFFFFF',
          100: '#F8F9FA', // Cool Canvas Background
          200: '#F1F3F5',
          300: '#E9ECEF',
          400: '#DEE2E6',
          500: '#CED4DA',
        },
        // Mapped Aliases for seamless component compatibility
        cream: {
          50: '#FFFFFF',
          100: '#F8F9FA',
          200: '#F1F3F5',
          300: '#E9ECEF',
          400: '#DEE2E6',
          500: '#CED4DA',
        },
        navy: {
          900: '#0B0C0E',
          800: '#121417', // Charcoal Black
          700: '#181A20',
          600: '#23262F',
          500: '#353945',
        },
        marigold: {
          400: '#FF7A45',
          500: '#FF5A1F', // Electric Orange
          600: '#E04812',
          700: '#B83508',
        },
        moss: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981', // Emerald Verified
          600: '#059669',
          700: '#047857',
        },
        rust: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444', // Vivid Red / Urgent
          600: '#DC2626',
          700: '#B91C1C',
        },
        slate: {
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B', // Neutral Cool Grey
          600: '#475569',
        }
      },
      fontFamily: {
        serif: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'], // Display headers with sharp Swiss geometry
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(18, 20, 23, 0.05), 0 1px 2px rgba(18, 20, 23, 0.03)',
        'card-hover': '0 10px 25px -5px rgba(18, 20, 23, 0.1), 0 8px 10px -6px rgba(18, 20, 23, 0.06)',
        'modal': '0 25px 50px -12px rgba(18, 20, 23, 0.25)',
      },
      animation: {
        'reveal-up': 'revealUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'bubble-in': 'bubbleIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s infinite ease-in-out',
        'bounce-subtle': 'bounceSubtle 2s infinite ease-in-out',
        'shimmer': 'shimmer 2.5s infinite linear',
        'float': 'floatParticle 3.5s infinite ease-in-out',
        'float-delayed': 'floatParticle 4s infinite ease-in-out 1.5s',
        'confetti': 'confettiBurst 1.2s ease-out forwards',
        'marquee': 'marquee 28s linear infinite',
        'shine-sweep': 'shineSweep 2s infinite',
      },
      keyframes: {
        revealUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bubbleIn: {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        pulseSubtle: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.12)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        floatParticle: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(3deg)' },
        },
        confettiBurst: {
          '0%': { transform: 'scale(0.5) translateY(0)', opacity: '1' },
          '50%': { transform: 'scale(1.2) translateY(-20px)', opacity: '0.9' },
          '100%': { transform: 'scale(1) translateY(-40px)', opacity: '0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shineSweep: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        }
      }
    },
  },
  plugins: [],
}
