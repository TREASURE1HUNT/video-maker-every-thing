import {bundle} from '@remotion/bundler';
import {getCompositions,renderMedia,renderStill,getVideoMetadata} from '@remotion/renderer';
import path from 'node:path';
const serveUrl=await bundle({entryPoint:path.resolve('interview-index.tsx')});
const comps=await getCompositions(serveUrl),out=path.resolve('../dist/assets/produced');
await renderStill({serveUrl,composition:comps.find(c=>c.id==='InterviewCover'),frame:0,output:out+'/interview-cover.png',imageFormat:'png'});
await renderMedia({serveUrl,composition:comps.find(c=>c.id==='Interview'),codec:'h264',audioCodec:'aac',outputLocation:out+'/interview-v2.mp4',crf:21,concurrency:2,imageFormat:'jpeg',logLevel:'error'});
console.log('INTERVIEW_VERIFIED',JSON.stringify(await getVideoMetadata(out+'/interview-v2.mp4')));

