import {build} from 'esbuild';
import fs from 'node:fs/promises';import path from 'node:path';import crypto from 'node:crypto';
const root=path.resolve('dist'),release={};await fs.mkdir(path.join(root,'app'),{recursive:true});
for(const name of ['workspace','editor-app']){
 const result=await build({entryPoints:[path.join(root,name+'.js')],bundle:true,write:false,format:'esm',platform:'browser',target:'es2022',minify:true});
 const content=result.outputFiles[0].contents,hash=crypto.createHash('sha256').update(content).digest('hex').slice(0,16),file=`app/${name}-${hash}.js`;
 await fs.writeFile(path.join(root,file),content);release[name]=file;
}
for(const name of await fs.readdir(root)){if(!name.endsWith('.html'))continue;const file=path.join(root,name);let html=await fs.readFile(file,'utf8');for(const [entry,url]of Object.entries(release))html=html.replace(new RegExp('src="(?:app/)?'+entry+'(?:-[a-f0-9]+)?\\.js(?:\\?[^" ]*)?"','g'),'src="'+url+'"');await fs.writeFile(file,html)}
await fs.writeFile(path.join(root,'app/release.json'),JSON.stringify(release,null,2));console.log('FRONTEND_BUILD_OK',JSON.stringify(release));
