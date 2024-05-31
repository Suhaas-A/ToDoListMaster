import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    plugins: [react()],
    build: {
        assetsDir: 'static',
    },
    server: {
        port: 8000,
        cors: true,
        proxy: {
            "/api": {
                target: "https://ToDoList.Masterpythonanywhere.com/",
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
});
