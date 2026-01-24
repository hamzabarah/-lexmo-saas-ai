import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Neo-tech dark theme
                'neo-black': '#0A0A0F',
                'neo-dark': '#151520',
                'neo-cyan': '#00D9FF',
                'neo-violet': '#8B5CF6',
                'neo-gray': {
                    100: '#E5E7EB',
                    200: '#D1D5DB',
                    300: '#9CA3AF',
                    400: '#6B7280',
                    500: '#4B5563',
                    600: '#374151',
                    700: '#1F2937',
                    800: '#111827',
                    900: '#0A0A0F',
                },
            },
            fontFamily: {
                display: ['Inter', 'system-ui', 'sans-serif'],
                ar: ['Cairo', 'Tajawal', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            backgroundImage: {
                'gradient-neo': 'linear-gradient(135deg, #00D9FF 0%, #8B5CF6 100%)',
                'gradient-dark': 'linear-gradient(180deg, #0A0A0F 0%, #151520 100%)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'fade-in-up': 'fadeInUp 0.6s ease-out',
                'slide-in-right': 'slideInRight 0.4s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite',
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
                slideInRight: {
                    '0%': { transform: 'translateX(-20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                glow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(0, 217, 255, 0.5)' },
                    '50%': { boxShadow: '0 0 40px rgba(0, 217, 255, 0.8)' },
                },
            },
            boxShadow: {
                'neo': '0 4px 24px rgba(0, 217, 255, 0.1)',
                'neo-lg': '0 10px 40px rgba(0, 217, 255, 0.2)',
                'neo-violet': '0 4px 24px rgba(139, 92, 246, 0.1)',
            },
        },
    },
    plugins: [require("@tailwindcss/typography")],
};

export default config;
