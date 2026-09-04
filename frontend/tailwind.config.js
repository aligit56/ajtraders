/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class', // Enable dark mode toggle
  theme: {
    extend: {
      colors: {
        // Dark mode colors
        darkBg: '#0f0f0f',
        darkCard: '#1a1a1a',
        darkText: '#e0e0e0',
        darkTextSecondary: '#888888',
        darkBorder: '#333333',
        
        // Light mode colors
        lightBg: '#ffffff',
        lightCard: '#f5f5f5',
        lightText: '#1a1a1a',
        lightTextSecondary: '#666666',
        lightBorder: '#e0e0e0',
        
        // Accents (both modes)
        cyan: '#00d9ff',
        aqua: '#64ffda',
        darkBlue: '#0066cc',
        lightBlue: '#0099ff',
        success: { dark: '#00d962', light: '#00b300' },
        error: { dark: '#ff6b6b', light: '#cc0000' }
      }
    },
  },
  plugins: [],
}
