import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			brand: {
  				DEFAULT: '#00acc7',
  				dark: '#00bed1',
  				light: '#00d1dc'
  			},
  			// Custom VIP Color Palette
  			heliotrope: {
  				DEFAULT: '#8e68fd',
  				50: '#f5f3ff',
  				100: '#ede9fe',
  				200: '#ddd6fe',
  				300: '#c4b5fd',
  				400: '#a78bfa',
  				500: '#8e68fd',
  				600: '#7c3aed',
  				700: '#6d28d9',
  				800: '#5b21b6',
  				900: '#4c1d95',
  			},
  			robin: {
  				DEFAULT: '#00d1dc',
  				50: '#ecfeff',
  				100: '#cffafe',
  				200: '#a5f3fc',
  				300: '#67e8f9',
  				400: '#22d3ee',
  				500: '#00d1dc',
  				600: '#00bed1',
  				700: '#0891b2',
  				800: '#0e7490',
  				900: '#155e75',
  			},
  			pacific: {
  				DEFAULT: '#00acc7',
  				50: '#ecfeff',
  				100: '#cffafe',
  				200: '#a5f3fc',
  				300: '#67e8f9',
  				400: '#22d3ee',
  				500: '#00acc7',
  				600: '#0891b2',
  				700: '#0e7490',
  				800: '#155e75',
  				900: '#164e63',
  			},
  			purple: {
  				DEFAULT: '#5547d0',
  				50: '#faf5ff',
  				100: '#f3e8ff',
  				200: '#e9d5ff',
  				300: '#d8b4fe',
  				400: '#c084fc',
  				500: '#5547d0',
  				600: '#9333ea',
  				700: '#7e22ce',
  				800: '#6b21a8',
  				900: '#581c87',
  			},
  			mariner: {
  				DEFAULT: '#3977d3',
  				50: '#eff6ff',
  				100: '#dbeafe',
  				200: '#bfdbfe',
  				300: '#93c5fd',
  				400: '#60a5fa',
  				500: '#3977d3',
  				600: '#2563eb',
  				700: '#1d4ed8',
  				800: '#1e40af',
  				900: '#1e3a8a',
  			},
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
  		fontFamily: {
  			sans: [
  				'Inter',
                    ...fontFamily.sans
                ]
  		},
  		borderRadius: {
  			xl: '1rem',
  			'2xl': '1.25rem',
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		boxShadow: {
  			card: '0 10px 30px rgba(0,0,0,0.06)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'loading-bar': {
  				'0%': {
  					transform: 'translateX(-100%)'
  				},
  				'100%': {
  					transform: 'translateX(400%)'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'loading-bar': 'loading-bar 1.5s ease-in-out infinite',
  			'pulse-delayed': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) 1s infinite'
  		},
  		animationDelay: {
  			'75': '75ms',
  			'100': '100ms',
  			'150': '150ms',
  			'200': '200ms',
  			'300': '300ms',
  			'500': '500ms',
  			'700': '700ms',
  			'1000': '1000ms',
  		}
  	}
  },
  plugins: [
  	require("tailwindcss-animate"),
  	// Plugin for animation delay utilities
  	function({ matchUtilities, theme }: any) {
  		matchUtilities(
  			{
  				'animation-delay': (value: string) => {
  					return {
  						'animation-delay': value,
  					}
  				},
  			},
  			{
  				values: theme('animationDelay'),
  			}
  		)
  	}
  ],
};

export default config;
