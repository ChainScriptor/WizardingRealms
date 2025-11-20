/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        rune: ['"Uncial Antiqua"', 'serif'],
        wizard: ['"Cinzel Decorative"', 'serif'],
        parchment: ['"IM Fell English"', 'serif']
      },
      fontWeight: {
        normal: '500',
        medium: '600',
        semibold: '700',
        bold: '800',
        extrabold: '900'
      },
      colors: {
        parchment: {
          900: '#0e0c0b',
          800: '#151210',
          700: '#1c1917',
          600: '#221e1b'
        },
        mana: {
          300: '#7bd3ff',
          400: '#5fb6ff',
          500: '#3a9bff',
          600: '#2a77ff'
        },
        rarity: {
          common: '#5a5a5a',
          uncommon: '#2dd4bf',
          rare: '#60a5fa',
          epic: '#a78bfa',
          legendary: '#f59e0b',
          mythic: '#f472b6'
        },
        // shadcn/ui colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      boxShadow: {
        glow: '0 0 20px rgba(90, 200, 255, 0.35)',
        'glow-gold': '0 0 24px rgba(245, 158, 11, 0.45)',
        'glow-mythic': '0 0 30px rgba(244, 114, 182, 0.55)'
      },
      backgroundImage: {
        forest: 'url("https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop")',
        parchment: 'url("https://images.unsplash.com/photo-1522444195799-478538b28823?q=80&w=1974&auto=format&fit=crop")',
        texture: 'url("https://images.unsplash.com/photo-1520256862855-398228c41684?q=80&w=1974&auto=format&fit=crop")'
      }
    }
  },
  plugins: []
}

