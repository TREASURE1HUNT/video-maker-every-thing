import {build} from 'esbuild';
import {cp,mkdir,writeFile,readFile} from 'node:fs/promises';
import path from 'node:path';
const source=path.resolve(import.meta.dirname,'../dist'),dest=path.resolve(import.meta.dirname,'../../pages-dist');
await mkdir(dest,{recursive:true});await cp(source,dest,{recursive:true,filter:p=>!/[\\/](server|\.openai)([\\/]|$)/.test(p)});
await build({entryPoints:[path.resolve(import.meta.dirname,'../server/pages-gateway.mjs')],outfile:path.join(dest,'_worker.js'),bundle:true,format:'esm',platform:'browser',target:'es2022'});
await writeFile(path.join(dest,'_routes.json'),JSON.stringify({version:1,include:['/*'],exclude:[]}));
console.log('PAGES_GATEWAY_BUILD_OK');
