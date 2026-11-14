import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
export default defineConfig({esbuild:{jsx:'automatic'},root:'admin',base:'/admin/',plugins:[tailwindcss()],resolve:{alias:{'@':path.resolve('admin/src')}},build:{outDir:'build',emptyOutDir:true}});

