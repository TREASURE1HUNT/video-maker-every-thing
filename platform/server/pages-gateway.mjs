import {secureResponse} from './security-headers.mjs';
// Pages serves the website; the existing VMET backend remains the source of truth.
const backend='https://video-maker-every-thing.izhanshahfarul.chatgpt.site';
const app={async fetch(req,env){const url=new URL(req.url);if(!url.pathname.startsWith('/api/')&&!url.pathname.startsWith('/admin')&&url.pathname!=='/v1/chat')return env.ASSETS.fetch(req);
 const headers=new Headers(req.headers);for(const k of [...headers.keys()])if(k.startsWith('oai-')||k==='host'||k.startsWith('cf-'))headers.delete(k);
 headers.set('X-VMET-Frontend-Origin',url.origin);
 if(headers.has('Origin')){if(headers.get('Origin')!==url.origin)return Response.json({error:'Другой источник запроса'},{status:403});headers.set('Origin',backend)}
 const r=await fetch(new Request(backend+url.pathname+url.search,{method:req.method,headers,redirect:'manual',...(!['GET','HEAD'].includes(req.method)?{body:req.body,duplex:'half'}:{})}));const h=new Headers(r.headers);h.set('Cache-Control','no-store');const location=h.get('Location');if(location?.startsWith(backend+'/'))h.set('Location',url.origin+location.slice(backend.length));return new Response(r.body,{status:r.status,headers:h});
}};

export default {async fetch(req,env){return secureResponse(await app.fetch(req,env),{localASR:new URL(req.url).pathname==='/local-asr-worker-v1.js'})}};
