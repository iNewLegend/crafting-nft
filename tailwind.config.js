import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        // ...
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            animation: {
                'ping-delay-200': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite 200ms',
                'ping-delay-400': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite 400ms',
            },
        },
    },
    darkMode: "class",
    plugins: [ nextui() ]
}
