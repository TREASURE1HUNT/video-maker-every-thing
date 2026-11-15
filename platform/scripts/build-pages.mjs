import './build-admin.mjs';
import {cp,mkdir,writeFile,readFile} from 'node:fs/promises';import {build} from 'esbuild';
await mkdir('pages-dist',{recursive:true});
await cp('dist','pages-dist',{recursive:true,filter:p=>!/[\\/](server|\.openai)([\\/]|$)/.test(p)});
// Advanced-mode Pages Worker owns API and private admin; ASSETS serves public files.
await build({entryPoints:['server/pages-standalone.mjs'],outfile:'pages-dist/_worker.js',bundle:true,format:'esm',platform:'browser',target:'es2022',minify:true});
await writeFile('pages-dist/_routes.json',JSON.stringify({version:1,include:['/api/*','/admin','/admin/*','/v1/*'],exclude:[]}));
console.log('PAGES_BUILD_OK');
