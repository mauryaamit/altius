import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // MBA base surfaces
        'mba-bg':           '#FAF7F0',
        'mba-surface':      '#FFFFFF',
        'mba-surface-sunk': '#F1EDE2',
        // MBA ink
        'mba-ink':          '#1F1B16',
        'mba-ink-soft':     '#5B5448',
        'mba-ink-faint':    '#9B9282',
        // MBA accent
        'mba-accent':       '#1E3A5F',
        'mba-accent-soft':  '#E8EDF2',
        // Chip colors
        'chip-marketing':   '#B5562C',
        'chip-finance':     '#2F6F4E',
        'chip-consulting':  '#6B4C8A',
        'chip-operations':  '#1E3A5F',
        'chip-strategy':    '#8A6D1E',
        'chip-people':      '#A14C5C',
        // Semantic
        'mba-rule':         '#DDD5C3',
        'mba-success':      '#2F6F4E',
        'mba-warning':      '#8A6D1E',
        'mba-danger':       '#9B3A33',
      },
      fontFamily: {
        display:    ['Cormorant Garamond', 'Georgia', 'serif'],
        body:       ['DM Sans', 'system-ui', 'sans-serif'],
        mono:       ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
      },
      fontSize: {
        'display':    ['clamp(1.75rem, 1.4rem + 1.5vw, 2.5rem)', { lineHeight: '1.25' }],
        'h2-fluid':   ['clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)', { lineHeight: '1.25' }],
        'h3':         ['1.125rem', { lineHeight: '1.25' }],
        'body':       ['1rem', { lineHeight: '1.6' }],
        'caption':    ['0.875rem', { lineHeight: '1.6' }],
        'mono-label': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.06em' }],
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '24px',
        '6': '32px',
        '7': '48px',
        '8': '64px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(31,27,22,0.06)',
        md: '0 2px 8px rgba(31,27,22,0.08)',
      },
      maxWidth: {
        measure: '66ch',
        'measure-sm': '42ch',
      },
      borderColor: {
        rule: '#DDD5C3',
      },
    },
  },
  plugins: [],
}

export default config
