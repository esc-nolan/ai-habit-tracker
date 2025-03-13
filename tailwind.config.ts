// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Ensure all components/pages are included
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"], // Use Poppins as default
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};
export default config;
