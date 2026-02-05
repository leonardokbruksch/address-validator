import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Geist", "Sohne", "Mona Sans", "Segoe UI", "sans-serif"],
			},
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			boxShadow: {
				soft: "0 10px 30px -20px hsl(220 12% 10% / 0.35)",
			},
			borderRadius: {
				lg: "0.8rem",
				md: "0.6rem",
				sm: "0.4rem",
			},
		},
	},
	plugins: [],
} satisfies Config;
