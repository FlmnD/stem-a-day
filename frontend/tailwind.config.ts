import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/**/*.{ts,tsx,js,jsx,mdx}",
        "./app/**/*.{ts,tsx,js,jsx,mdx}",
        "./components/**/*.{ts,tsx,js,jsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: { ...colors.sky, DEFAULT: colors.sky[600] },
                sea: { ...colors.emerald, DEFAULT: colors.emerald[600] },

                surface: {
                    DEFAULT: "#ffffff",        
                    muted: colors.gray[50],     
                    border: colors.gray[200],   
                    dark: "#0a0a0a",           
                    darkmuted: "#0f172a",      
                    darkborder: "#1f2937",
                },
            },
        },
    },
    plugins: [],
};

export default config;
