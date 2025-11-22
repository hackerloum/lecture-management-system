import { fontFamily } from "tailwindcss/defaultTheme";
import tailwindcssAnimate from "tailwindcss-animate";

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
    "./src/styles/**/*.{ts,tsx}",
  ],
  theme: {
  	container: {
  		center: true,
  		padding: {
  			DEFAULT: '1rem',
  			sm: '1.5rem',
  			lg: '2rem',
  			xl: '2.5rem',
  			'2xl': '3rem'
  		},
  		screens: {
  			'2xl': '1280px'
  		}
  	},
  	extend: {
  		colors: {
  			brand: {
  				DEFAULT: '#4c2cd9',
  				foreground: '#f3f4ff',
  				dark: '#1e3a8a',
  				light: '#7c3aed',
  				gradientStart: '#1e3a8a',
  				gradientEnd: '#7c3aed'
  			},
  			accent: {
  				orange: '#f97316',
  				cyan: '#06b6d4',
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			neutral: {
  				'50': '#f9fafb',
  				'100': '#f3f4f6',
  				'200': '#e5e7eb',
  				'300': '#d1d5db',
  				'400': '#9ca3af',
  				'500': '#6b7280',
  				'600': '#4b5563',
  				'700': '#374151',
  				'800': '#1f2937',
  				'900': '#111827',
  				'950': '#030712'
  			},
  			success: '#10b981',
  			warning: '#f59e0b',
  			error: '#ef4444',
  			info: '#3b82f6',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accentSurface: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-sans)',
                    ...fontFamily.sans
                ],
  			heading: [
  				'var(--font-heading)',
                    ...fontFamily.sans
                ]
  		},
  		boxShadow: {
  			xs: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
  			sm: '0 2px 4px -1px rgba(15, 23, 42, 0.08), 0 4px 6px -1px rgba(15, 23, 42, 0.03)',
  			DEFAULT: '0 10px 15px -3px rgba(15, 23, 42, 0.12), 0 4px 6px -4px rgba(15, 23, 42, 0.08)',
  			lg: '0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 10px 10px -5px rgba(15, 23, 42, 0.08)',
  			xl: '0 25px 50px -12px rgba(15, 23, 42, 0.35)',
  			'glass-sm': '0 4px 30px rgba(30, 58, 138, 0.05)',
  			'glass-lg': '0 25px 45px rgba(30, 58, 138, 0.12)'
  		},
  		borderRadius: {
  			xl: '16px',
  			'2xl': '24px',
  			'glass': '20px',
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		backdropBlur: {
  			glass: '20px'
  		},
  		transitionTimingFunction: {
  			brand: 'cubic-bezier(0.4, 0, 0.2, 1)'
  		},
  		spacing: {
  			'1.5': '0.375rem',
  			'4.5': '1.125rem',
  			'6.5': '1.625rem'
  		},
  		animation: {
  			'fade-in': 'fadeIn 150ms ease-in forwards',
  			'scale-in': 'scaleIn 200ms var(--ease-out)',
  			'slide-in-left': 'slideInLeft 300ms ease-out forwards',
  			'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
  			'spin-slow': 'spin 2s linear infinite',
  			'shake-x': 'shakeX 400ms ease-in-out'
  		},
  		keyframes: {
  			fadeIn: {
  				from: {
  					opacity: '0'
  				},
  				to: {
  					opacity: '1'
  				}
  			},
  			scaleIn: {
  				from: {
  					opacity: '0',
  					transform: 'scale(0.95)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'scale(1)'
  				}
  			},
  			slideInLeft: {
  				from: {
  					transform: 'translateX(-12px)',
  					opacity: '0'
  				},
  				to: {
  					transform: 'translateX(0)',
  					opacity: '1'
  				}
  			},
  			pulseSoft: {
  				'0%, 100%': {
  					opacity: '0.6'
  				},
  				'50%': {
  					opacity: '1'
  				}
  			},
  			shakeX: {
  				'0%, 100%': {
  					transform: 'translateX(0)'
  				},
  				'25%': {
  					transform: 'translateX(-4px)'
  				},
  				'75%': {
  					transform: 'translateX(4px)'
  				}
  			}
  		}
  	}
  },
  plugins: [tailwindcssAnimate],
};

export default config;

