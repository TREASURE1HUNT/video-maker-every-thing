import {setStorageScope} from './project-store.js';
export const APP_ORIGIN='https://video-maker-every-thing.izhanshahfarul.chatgpt.site';
export const STARTER_PLANS=[{id:'lite',price_minor:79000,credits:100,enabled:1,video_limit:5,period_days:14},{id:'plus',price_minor:169000,credits:350,enabled:1,video_limit:7,period_days:7},{id:'pro',price_minor:349000,credits:1000,enabled:1,video_limit:10,period_days:7}];
let current={plan:'free',canCreate:false,endsAt:null,models:[],plans:STARTER_PLANS,paymentReady:false,authenticated:false};
export async function customer(path,data){const r=await fetch(path,{method:data?'POST':'GET',credentials:'same-origin',headers:{'Content-Type':'application/json'},...(data?{body:JSON.stringify(data)}:{})});const type=r.headers.get('Content-Type')||'';if(!type.includes('json'))throw new Error('Откройте основной сайт и войдите в аккаунт');const j=await r.json();if(!r.ok)throw Object.assign(new Error(j.error||'Ошибка сервера'),{status:r.status});return j}
export async function loadMembership(){try{current={...await customer('/api/customer'),authenticated:true}}catch(e){current={connectionError:e.status===401?'':e.message,plan:'free',canCreate:false,models:[],plans:STARTER_PLANS,paymentReady:false,authenticated:false}}setStorageScope(current.authenticated?current.user?.id:null);return current}
export const membership=()=>current;
export const canCreate=()=>!!current.canCreate&&Date.parse(current.endsAt)>Date.now();
export function paywall(){location.href='pricing.html';}
export async function registerProject(name,model='local'){await loadMembership();if(!canCreate()){paywall();throw new Error('Для создания нужна подписка Lite, Plus или Pro')}return customer('/api/projects',{name,model_id:model})}
export function modelOptions(select,selected='local'){
 select.replaceChildren();const local=document.createElement('option');local.value='local';local.textContent='Локальный планировщик · Lite+';select.append(local);
 for(const m of current.models||[]){const o=document.createElement('option');o.value=m.id;o.textContent=m.name+' · '+m.min_plan+' · '+m.cost+' кр.'+(m.available?'':' — '+(m.reason||'недоступно'));o.disabled=!m.available;select.append(o)}
 select.value=[...select.options].some(o=>o.value===selected&&!o.disabled)?selected:'local';
}
