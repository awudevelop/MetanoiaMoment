import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Faith-inspired warm earth tones
        primary: {
          50: '#fef7ed',
          100: '#fdecd4',
          200: '#fad5a8',
          300: '#f6b871',
          400: '#f19038',
          500: '#ed7412', // Main gold/amber - hope, divine light
          600: '#de5a08',
          700: '#b84109',
          800: '#93340f',
          900: '#782d0f',
          950: '#411405',
        },
        secondary: {
          50: '#f6f5f0',
          100: '#e9e7db',
          200: '#d5d0ba',
          300: '#bdb492',
          400: '#a89b72',
          500: '#988862', // Warm earth tone - stability, eternity
          600: '#816f53',
          700: '#685845',
          800: '#574a3c',
          900: '#4b4035',
          950: '#2a231c',
        },
        accent: {
          50: '#f4f9f4',
          100: '#e5f2e6',
          200: '#cce5ce',
          300: '#a3d0a7',
          400: '#72b478',
          500: '#4d9653', // Growth green - new life, transformation
          600: '#3b7a41',
          700: '#316136',
          800: '#2b4e2e',
          900: '#254128',
          950: '#102313',
        },
        // Neutral tones for backgrounds
        warm: {
          50: '#fafaf8',
          100: '#f5f4f0',
          200: '#e8e6de',
          300: '#d6d2c5',
          400: '#bfb9a6',
          500: '#a9a08a',
          600: '#968a73',
          700: '#7d7361',
          800: '#675f52',
          900: '#554f45',
          950: '#2d2a24',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-lora)', 'Georgia', 'serif'],
        display: ['var(--font-playfair)', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-divine':
          'linear-gradient(135deg, var(--tw-gradient-stops))',
      },
      animation: {
        // Base animations
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.5s ease-out forwards',
        'fade-in-left': 'fadeInLeft 0.5s ease-out forwards',
        'fade-in-right': 'fadeInRight 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-up': 'slideInUp 0.4s ease-out forwards',
        'slide-in-down': 'slideInDown 0.4s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.4s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'scale-in-bounce': 'scaleInBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 0.5s ease-out',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'shimmer': 'shimmer 2s linear infinite',
        // Toast/Modal animations
        'in': 'animateIn 0.2s ease-out',
        'out': 'animateOut 0.2s ease-in',
        'slide-in-from-right-full': 'slideInFromRight 0.3s ease-out',
        'slide-in-from-bottom-4': 'slideInFromBottom 0.2s ease-out',
        'zoom-in-95': 'zoomIn 0.2s ease-out',
        'zoom-out-95': 'zoomOut 0.2s ease-in',
        // Celebration animations
        'confetti': 'confetti 3s ease-out forwards',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
        'celebration': 'celebration 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleInBounce: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(5deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        animateIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        animateOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideInFromRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInFromBottom: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        zoomOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        celebration: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
