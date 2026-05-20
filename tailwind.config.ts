import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#15171e",      // بک‌گراند اصلی
          surface: "#23252b", // خاکستری (پنل‌ها و کارت‌ها)
          surface_hover: "#313339",
          surface_m: "#88898c",
          menu: "#1a1c23",
          zard: "#ffb400",
          sabz: "#75dd04",
          blue: "#0074e0",    // آبی اصلی (دکمه‌ها و لینک‌ها)
          m_khonsa: "#c2c2c4", // متن خنثی
          active: "#f8f5f9",  // متن روشن/فعال
          white: "#ffffff",   // سفید مطلق
        },
      },
      fontFamily: {
        // اضافه کردن فونت یکان به عنوان فونت پایه (sans)
        sans: ['var(--font-yekan)', 'sans-serif'],
      },
      spacing: {
        '5px': '5px',
        '10px': '10px',
      },
      maxWidth: {
        'site': '1600px',
      },
    },
  },
  plugins: [],
};

export default config;
