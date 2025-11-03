import type { Config } from 'tailwindcss'
const config: Config = {
content: [
'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
],
theme: {
extend: {
colors: {
primary: '#007AFF',
success: '#34C759',
warning: '#FF9500',
danger: '#FF3B30',
},
},
},
plugins: [],
} 
export default config