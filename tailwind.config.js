import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
	plugins: [
		nextui({
			themes: {
				light: {
					colors: {
						primary: {
							DEFAULT: "#6EC4A7",
							foreground: "#0a0a0a",
						},
						secondary: {
							DEFAULT: "#0a0a0a",
							foreground: "#ffffff",
						},
						default: {
							DEFAULT: "#45596B",
							foreground: "#ffffff",
						},
						success: {
							DEFAULT: "#647F94",
							foreground: "#ffffff",
						} /*  */,
					},
				},
				dark: {
					colors: {
						primary: {
							DEFAULT: "#6EC4A7",
							foreground: "#0a0a0a",
						},
						secondary: {
							DEFAULT: "#0a0a0a",
							foreground: "#ffffff",
						},
						default: {
							DEFAULT: "#45596B",
							foreground: "#ffffff",
						},
						success: {
							DEFAULT: "#647F94",
							foreground: "#ffffff",
						},
					},
				},
			},
		}),
	],
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {},
	},
	darkMode: "class",
};
