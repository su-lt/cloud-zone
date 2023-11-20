/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        container: {
            center: true,
        },
        extend: {
            screens: {
                "2xl": "1280px",
            },
            fontFamily: {
                poppins: ["Poppins", "sans-serif"],
            },
            colors: {
                primary: "#16405B",
                gray1: "#333",
                gray2: "#666",
                gray3: "#999",
                custom: {
                    100: "rgba(178, 178, 178, 0.1)",
                    300: "rgba(178, 178, 178, 0.3)",
                    500: "rgba(178, 178, 178, 0.5)",
                    1000: "rgba(178, 178, 178, 1)",
                },
            },
            boxShadow: {
                neon: "0 0 5px theme('colors.purple.200'), 0 0 20px theme(colors.purple.700)",
            },
        },
    },
    plugins: [],
};
