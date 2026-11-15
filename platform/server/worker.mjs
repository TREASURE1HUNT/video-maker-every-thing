import {secureResponse} from './security-headers.mjs';
import {reconcileOwner} from './ownership.mjs';
import {sessionUser} from './auth.mjs';
import assets from './assets.generated.mjs';
import {api} from './api.mjs';
const app={async fetch(req,env){
 const url=new URL(req.url);
 // External Pages ingress must never accept platform identity headers from visitors.
 if(env.PAGES_STANDALONE==='1'&&env.ASSETS){const headers=new Headers(req.headers);for(const k of [...headers.keys()])if(k.startsWith('oai-authenticated-'))headers.delete(k);req=new Request(req,{headers});}
 if(url.pathname.startsWith('/api/')||url.pathname==='/v1/chat')return api(req,env);
 if(url.pathname==='/admin'||url.pathname.startsWith('/admin/')){await reconcileOwner(env);if(!env.DB)return new Response('Service unavailable',{status:503});const local=await sessionUser(req,env),email=req.headers.get('oai-authenticated-user-email')?.toLowerCase();if(!local&&!email)return Response.redirect(url.origin+'/login.html?next=%2Fadmin%2F',302);const member=local||await env.DB.prepare('SELECT role,status FROM users WHERE email=?').bind(email).first();const ownerSSO=!local&&email===env.ADMIN_EMAIL?.toLowerCase();if(!ownerSSO&&(!member||member.status!=='active'||!['owner','admin','finance','support'].includes(member.role)))return new Response('<!doctype html><html lang="ru"><meta charset="utf-8"><title>Доступ ограничен</title><h1>Доступ только для администраторов</h1><a href="/account.html">Перейти в свой аккаунт</a></html>',{status:403,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});}
 if(url.pathname==='/admin')return Response.redirect(url.origin+'/admin/',302);
 if(url.pathname.startsWith('/admin/')){
  const entry=assets[url.pathname]||(!url.pathname.split('/').pop().includes('.')?assets['/admin/index.html']:null);
  if(!entry)return new Response('Not found',{status:404});
  return new Response(Uint8Array.from(atob(entry.body),c=>c.charCodeAt(0)),{headers:{'Content-Type':entry.type,'Cache-Control':entry.type.includes('html')?'no-store':'public, max-age=3600','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'self' https://chatgpt.com https://*.chatgpt.com"}});
 }
 if(env.PAGES_STANDALONE==='1'&&env.ASSETS)return env.ASSETS.fetch(req);
 // Legacy hosting keeps its existing public mirror.
 if(req.method!=='GET'&&req.method!=='HEAD')return new Response('Method not allowed',{status:405});
 const target=new URL('https://treasure1hunt.github.io/video-maker-every-thing'+url.pathname+url.search);
 const response=await fetch(target,{method:req.method,headers:req.headers.has('Range')?{Range:req.headers.get('Range')}:undefined});const headers=new Headers(response.headers);if(/\.(?:html|js|css|json)$/.test(url.pathname)||url.pathname==='/'){headers.set('Cache-Control','no-store');headers.delete('Expires');headers.delete('Age')}return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}};

export default {async fetch(req,env){return secureResponse(await app.fetch(req,env))}};
