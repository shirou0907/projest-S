const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--el-color-primary)',
          'light-3': 'var(--el-color-primary-light-3)',
          'light-5': 'var(--el-color-primary-light-5)',
          'light-7': 'var(--el-color-primary-light-7)',
          'light-8': 'var(--el-color-primary-light-8)',
          'light-9': 'var(--el-color-primary-light-9)',
          'dark-2': 'var(--el-color-primary-dark-2)',
        },
        info: {
          DEFAULT: 'var(--el-color-info)',
          'light-3': 'var(--el-color-info-light-3)',
          'light-5': 'var(--el-color-info-light-5)',
          'light-7': 'var(--el-color-info-light-7)',
          'light-8': 'var(--el-color-info-light-8)',
          'light-9': 'var(--el-color-info-light-9)',
          'dark-2': 'var(--el-color-info-dark-2)',
        },
        success: {
          DEFAULT: 'var(--el-color-success)',
          'light-3': 'var(--el-color-success-light-3)',
          'light-5': 'var(--el-color-success-light-5)',
          'light-7': 'var(--el-color-success-light-7)',
          'light-8': 'var(--el-color-success-light-8)',
          'light-9': 'var(--el-color-success-light-9)',
          'dark-2': 'var(--el-color-success-dark-2)',
        },
        danger: {
          DEFAULT: 'var(--el-color-danger)',
          'light-3': 'var(--el-color-danger-light-3)',
          'light-5': 'var(--el-color-danger-light-5)',
          'light-7': 'var(--el-color-danger-light-7)',
          'light-8': 'var(--el-color-danger-light-8)',
          'light-9': 'var(--el-color-danger-light-9)',
          'dark-2': 'var(--el-color-danger-dark-2)',
        },
        warning: {
          DEFAULT: 'var(--el-color-warning)',
          'light-3': 'var(--el-color-warning-light-3)',
          'light-5': 'var(--el-color-warning-light-5)',
          'light-7': 'var(--el-color-warning-light-7)',
          'light-8': 'var(--el-color-warning-light-8)',
          'light-9': 'var(--el-color-warning-light-9)',
          'dark-2': 'var(--el-color-warning-dark-2)',
        },
        'border-color': {
          DEFAULT: 'var(--el-border-color)',
          darker: 'var(--el-border-color-darker)',
          dark: 'var(--el-border-color-dark)',
          light: 'var(--el-border-color-light)',
          lighter: 'var(--el-border-color-lighter)',
          'extra-light': 'var(--el-border-color-extra-light)',
        },
        fill: {
          DEFAULT: 'var(--el-fill-color)',
          light: 'var(--el-fill-color-light)',
          lighter: 'var(--el-fill-color-lighter)',
          'extra-light': 'var(--el-fill-color-extra-light)',
          dark: 'var(--el-fill-color-dark)',
          darker: 'var(--el-fill-color-darker)',
          blank: 'var(--el-fill-color-blank)',
        },
        'primary-text': 'var(--el-text-color-primary)',
        'regular-text': 'var(--el-text-color-regular)',
        'secondary-text': 'var(--el-text-color-secondary)',
        'placeholder-text': 'var(--el-text-color-placeholder)',
        'disabled-text': 'var(--el-text-color-disabled)',
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '600px',
          md: '728px',
          lg: '984px',
          xl: '1240px',
        },
      },
      screens: {
        xl: { max: '1279px' },
        // => @media (max-width: 1279px) { ... }

        lg: { max: '1023px' },
        // => @media (max-width: 1023px) { ... }

        md: { max: '767px' },
        // => @media (max-width: 767px) { ... }

        sm: { max: '639px' },
        // => @media (max-width: 639px) { ... }
      },
    },

    fontFamily: {
      sans: ['Manrope', ...defaultTheme.fontFamily.sans],
    },
  },
  plugins: [],
}
