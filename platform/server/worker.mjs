import assets from './assets.generated.mjs';
import {api} from './api.mjs';
export default {async fetch(req,env){
 const url=new URL(req.url);
 if(url.pathname.startsWith('/api/')||url.pathname==='/v1/chat')return api(req,env);
 if(url.pathname==='/admin')return Response.redirect(url.origin+'/admin/',302);
 if(url.pathname.startsWith('/admin/')){
  const entry=assets[url.pathname]||(!url.pathname.split('/').pop().includes('.')?assets['/admin/index.html']:null);
  if(!entry)return new Response('Not found',{status:404});
  return new Response(Uint8Array.from(atob(entry.body),c=>c.charCodeAt(0)),{headers:{'Content-Type':entry.type,'Cache-Control':entry.type.includes('html')?'no-store':'public, max-age=3600','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'self' https://chatgpt.com https://*.chatgpt.com"}});
 }
 // The public website remains on GitHub Pages; private mirror shares the authenticated API origin.
 if(req.method!=='GET'&&req.method!=='HEAD')return new Response('Method not allowed',{status:405});
 const target=new URL('https://treasure1hunt.github.io/video-maker-every-thing'+url.pathname+url.search);
 return fetch(target,{method:req.method});
}};
