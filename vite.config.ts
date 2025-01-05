import react from '@vitejs/plugin-react'
import {defineConfig} from "vitest/config"

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom', // Use jsdom for browser-like testing
        globals: true,
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler' // or "modern"
            }
        }
    },
})
