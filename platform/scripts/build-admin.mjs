import './build-frontend.mjs';
import {build} from 'vite';
import {build as bundle} from 'esbuild';
import {readFile,writeFile,mkdir,readdir,cp} from 'node:fs/promises';
import path from 'node:path';
await build();
const assets={};
async function scan(dir){for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())await scan(p);else{const key='/admin/'+path.relative('admin/build',p).replaceAll('\\','/');assets[key]={body:(await readFile(p)).toString('base64'),type:p.endsWith('.js')?'text/javascript':p.endsWith('.css')?'text/css':'text/html; charset=utf-8'};}}}
await scan('admin/build');
await writeFile('server/assets.generated.mjs','export default '+JSON.stringify(assets));
await mkdir('dist/server',{recursive:true});
await bundle({entryPoints:['server/worker.mjs'],outfile:'dist/server/index.js',bundle:true,format:'esm',platform:'browser',target:'es2022',minify:true});
await mkdir('dist/.openai',{recursive:true});
try{await cp('.openai/hosting.json','dist/.openai/hosting.json')}catch(e){if(e.code!=='ENOENT')throw e;await cp('hosting.example.json','dist/.openai/hosting.json')}
await cp('drizzle','dist/.openai/drizzle',{recursive:true});
console.log('ADMIN_BUILD_OK');
