// Configuration for Vite JS

import { defineConfig } from 'vite'

import path from 'path'

// set root directory to /src
const root = path.resolve(__dirname, 'public');
export default defineConfig({
    root,
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: path.resolve(root, 'index.html'),
            },
            output: {
                manualChunks: {
                    'd3': ['d3'],
                    'htl': ['htl']
                }
            }
        },
    },
})