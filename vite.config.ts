/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
    plugins: [tsconfigPaths(), react(), tailwindcss()],
    test: {
        environment: 'jsdom',
        watch: false,
        include: ['src/**/*.test.ts?(x)'],
        setupFiles: 'src/setup-tests.ts',
        exclude: ['src/e2e'],
    },
});
