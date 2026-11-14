import {fileURLToPath} from 'node:url';
process.chdir(fileURLToPath(new URL('.',import.meta.url)));
import {bundle} from '@remotion/bundler';
import {getCompositions,renderMedia,renderStill,getVideoMetadata} from '@remotion/renderer';
import path from 'node:path';import fs from 'node:fs';
import {catalog} from './catalog.mjs';
const out=path.resolve('../dist/assets/remotion');fs.mkdirSync(out,{recursive:true});
const browserExecutable=process.env.VMET_RENDER_BROWSER||'C:/Program Files/Google/Chrome/Application/chrome.exe';
const serveUrl=await bundle({entryPoint:path.resolve('src/index.tsx')});
const compositions=await getCompositions(serveUrl,{browserExecutable});
const results=[];
for(const c of compositions){const item=catalog.find(t=>'VMET-'+t.id===c.id),file=path.join(out,item.id+'.mp4');await renderMedia({composition:c,serveUrl,codec:'h264',outputLocation:file,browserExecutable,concurrency:3,crf:23,imageFormat:'jpeg',jpegQuality:85,overwrite:true,logLevel:'error'});await renderStill({composition:c,serveUrl,output:path.join(out,item.id+'.png'),frame:65,browserExecutable,imageFormat:'png',logLevel:'error'});const metadata=await getVideoMetadata(file);results.push({id:item.id,duration:metadata.durationInSeconds,width:metadata.width,height:metadata.height,bytes:fs.statSync(file).size});console.log('RENDER_OK',JSON.stringify(results.at(-1)));}
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify({version:1,renderer:'Remotion 4.0.543',upstream:'https://github.com/DojoCodingLabs/remotion-superpowers',upstreamCommit:'970efd2d2f4ce2492231a31ee684c2ead883f4bc',templates:catalog},null,2));fs.writeFileSync(path.join(out,'verification.json'),JSON.stringify(results,null,2));
