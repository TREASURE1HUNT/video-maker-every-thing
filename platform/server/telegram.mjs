import {seal,unseal} from './ai.mjs';
import {sessionUser,finishSession,sessionHeaders} from './auth.mjs';
const enc=new TextEncoder(),now=()=>new Date().toISOString();
const st=(e,q,...a)=>e.DB.prepare(q).bind(...a),one=(e,q,...a)=>st(e,q,...a).first();
const fail=(status,message)=>{throw Object.assign(new Error(message),{status})};
const out=(d,status=200,headers={})=>Response.json(d,{status,headers:{'Cache-Control':'no-store',...headers}});
const hex=b=>Array.from(new Uint8Array(b),x=>x.toString(16).padStart(2,'0')).join('');
const hash=async s=>hex(await crypto.subtle.digest('SHA-256',enc.encode(s)));
const equal=(a,b)=>{let d=a.length^b.length;for(let i=0;i<Math.max(a.length,b.length);i++)d|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);return d===0};
async function hmac(key,data){const k=await crypto.subtle.importKey('raw',typeof key==='string'?enc.encode(key):key,{name:'HMAC',hash:'SHA-256'},false,['sign']);return crypto.subtle.sign('HMAC',k,enc.encode(data))}
export async function validateTelegramInitData(raw,token,seconds=Date.now()/1000){
 if(typeof raw!=='string'||raw.length>12000)fail(400,'Откройте приложение из Telegram');
 const p=new URLSearchParams(raw),keys=[...p.keys()];if(new Set(keys).size!==keys.length)fail(401,'Повторяющиеся поля Telegram');
 const supplied=p.get('hash')||'';p.delete('hash');const t=Number(p.get('auth_date'));
 if(!/^[a-f0-9]{64}$/.test(supplied)||!Number.isFinite(t)||t<seconds-300||t>seconds+30)fail(401,'Сеанс Telegram истёк. Откройте приложение заново');
 const check=[...p.entries()].sort(([a],[b])=>a<b?-1:a>b?1:0).map(([k,v])=>k+'='+v).join('\n');
 if(!equal(supplied,hex(await hmac(await hmac('WebAppData',token),check))))fail(401,'Подпись Telegram не подтверждена');
 let u;try{u=JSON.parse(p.get('user'))}catch{fail(401,'Профиль Telegram не найден')}
 if(!Number.isSafeInteger(u?.id)||u.id<=0)fail(401,'Некорректный профиль Telegram');
 return {id:String(u.id),name:String(u.first_name||'Пользователь').slice(0,70),proof:supplied};
}
const cfg=async e=>await one(e,'SELECT * FROM telegram_config WHERE id=?','main')||{enabled:e.TELEGRAM_ENABLED==='1'&&!!e.TELEGRAM_BOT_TOKEN&&!!e.TELEGRAM_APP_URL?1:0,bot_secret:'',username:e.TELEGRAM_BOT_USERNAME||'',app_url:e.TELEGRAM_APP_URL||'',welcome:'Создавайте видео, обложки и субтитры в VMET. Откройте студию ниже.'};
const botToken=async(e,c)=>c.bot_secret?unseal(c.bot_secret,e,'telegram:bot'):e.TELEGRAM_BOT_TOKEN||'';
async function bot(e,c,method,data={}){const token=await botToken(e,c);if(!token)fail(503,'Добавьте токен бота');let r;try{r=await fetch('https://api.telegram.org/bot'+token+'/'+method,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(12000)});const d=await r.json();if(!r.ok||!d.ok)throw Error();return d.result}catch{fail(502,'Telegram не подтвердил запрос. Проверьте токен и подключение')}}
async function body(req){const s=await req.text();if(s.length>64000)fail(413,'Запрос слишком большой');try{return JSON.parse(s)}catch{fail(400,'Ожидается JSON')}}
function appURL(value){let u;try{u=new URL(value)}catch{fail(400,'Укажите HTTPS-адрес приложения')}if(u.protocol!=='https:'||u.username||u.password||u.hash||u.search||u.pathname!=='/miniapp.html')fail(400,'Укажите https://ваш-домен/miniapp.html');return u.href}
export async function telegramPublic(req,env){
 const p=new URL(req.url).pathname;if(!['/api/telegram/webhook','/api/telegram/session','/api/telegram/link','/api/telegram/info'].includes(p))return null;
 const c=await cfg(env);
 if(p.endsWith('/info')&&req.method==='GET')return out({enabled:!!c.enabled,username:c.username,appUrl:c.app_url});
 if(req.method!=='POST')fail(405,'Ожидается POST');
 if(p.endsWith('/webhook')){
  if(!c.enabled||!env.TELEGRAM_WEBHOOK_SECRET||!equal(req.headers.get('X-Telegram-Bot-Api-Secret-Token')||'',env.TELEGRAM_WEBHOOK_SECRET))fail(403,'Неверная подпись webhook');
  const b=await body(req);if(!Number.isSafeInteger(b.update_id))fail(400,'Некорректное обновление');
  const claim=await st(env,'INSERT OR IGNORE INTO telegram_updates VALUES(?,?)',b.update_id,now()).run();if(!claim.meta.changes)return out({ok:true});
  try{const m=b.message;if(m?.chat?.type==='private'&&m.from?.id===m.chat.id){
   const command=String(m.text||'').split(/[ @]/)[0];let text=c.welcome;
   if(command==='/help')text='Загрузите материалы в студии, выберите модель ИИ, настройте монтаж, субтитры и обложку. Проекты и кредиты доступны в вашем аккаунте. Материалы редактора хранятся на устройстве.';
   else if(command==='/balance'){const u=await one(env,"SELECT u.* FROM users u JOIN auth_identities i ON i.user_id=u.id WHERE i.provider='telegram' AND i.subject=?",String(m.from.id));const s=u&&await one(env,'SELECT plan,ends_at FROM subscriptions WHERE user_id=?',u.id);text=u?.status==='active'?`Баланс: ${u.credits} кредитов. Тариф: ${s&&s.ends_at>now()?s.plan:'free'}.`:'Откройте приложение, чтобы войти и посмотреть баланс.'}
   else if(!['/start','/studio'].includes(command))text='Монтаж и загрузка материалов доступны в приложении. Нажмите «Открыть студию».';
   await bot(env,c,'sendMessage',{chat_id:m.chat.id,text,reply_markup:{inline_keyboard:[[{text:'Открыть студию',web_app:{url:c.app_url}}]]}});
  }return out({ok:true})}catch(e){await st(env,'DELETE FROM telegram_updates WHERE id=?',b.update_id).run();throw e}
 }
 if(req.headers.get('Origin')!==new URL(req.url).origin)fail(403,'Другой источник запроса');
 if(!c.enabled)fail(503,'Вход через Telegram пока выключен');
 const b=await body(req),v=await validateTelegramInitData(b.initData,await botToken(env,c)),local=await sessionUser(req,env);
 let identity=await one(env,"SELECT u.* FROM users u JOIN auth_identities i ON i.user_id=u.id WHERE i.provider='telegram' AND i.subject=?",v.id);
 if(p.endsWith('/link')){if(!local||local.status!=='active')fail(401,'Сначала войдите в существующий аккаунт');if(identity&&identity.id!==local.id)fail(409,'Telegram уже связан с другим аккаунтом');identity=local}
 else if(local&&identity?.id===local.id)return out({ok:true,linked:true});
 if(!p.endsWith('/link')&&local)fail(409,'Сначала свяжите Telegram с текущим аккаунтом');
 await env.DB.batch([st(env,'DELETE FROM telegram_proofs WHERE created_at<?',new Date(Date.now()-3600000).toISOString()),st(env,'DELETE FROM telegram_updates WHERE created_at<?',new Date(Date.now()-7*86400000).toISOString())]);
 const used=await st(env,'INSERT OR IGNORE INTO telegram_proofs VALUES(?,?)',await hash(v.proof),now()).run();if(!used.meta.changes)fail(401,'Откройте приложение заново');
 if(!identity){const id=crypto.randomUUID();await st(env,"INSERT INTO users VALUES(?,?,?,'user','active','free',0,'[\"*\"]',?)",id,'tg-'+v.id+'@telegram.invalid',v.name,now()).run();identity=await one(env,'SELECT * FROM users WHERE id=?',id)}
 if(identity.status!=='active')fail(403,'Аккаунт приостановлен');
 await st(env,"INSERT OR IGNORE INTO auth_identities VALUES(?,?,'telegram',?,?)",'telegram:'+v.id,identity.id,v.id,now()).run();
 const raw=await finishSession(env,identity,'telegram');return out({ok:true},200,sessionHeaders(raw));
}
export async function telegramAdmin(req,env,u){
 const p=new URL(req.url).pathname;if(!p.startsWith('/api/admin/telegram/'))return null;if(u.role!=='owner')fail(403,'Настройки Telegram меняет владелец');
 const c=await cfg(env);if(p.endsWith('/settings')&&req.method==='GET')return out({enabled:!!c.enabled,username:c.username,app_url:c.app_url,welcome:c.welcome,hasToken:!!(c.bot_secret||env.TELEGRAM_BOT_TOKEN),hasWebhookSecret:!!env.TELEGRAM_WEBHOOK_SECRET});
 if(req.method!=='POST')fail(405,'Ожидается POST');const b=await body(req);
 if(p.endsWith('/settings')){const url=appURL(b.app_url);if(new URL(url).origin!==new URL(req.url).origin)fail(400,'Mini App должен находиться на этом сайте');let secret=c.bot_secret;if(b.token){if(!/^\d{5,15}:[A-Za-z0-9_-]{30,100}$/.test(b.token))fail(400,'Проверьте токен бота');secret=await seal(b.token,env,'telegram:bot')}
  if(b.enabled&&!(secret||env.TELEGRAM_BOT_TOKEN))fail(400,'Добавьте токен бота');await st(env,'INSERT INTO telegram_config VALUES(?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET enabled=excluded.enabled,bot_secret=excluded.bot_secret,app_url=excluded.app_url,welcome=excluded.welcome,updated_at=excluded.updated_at','main',b.enabled?1:0,secret,c.username,url,String(b.welcome||c.welcome).slice(0,1000),now()).run();return out({ok:true})}
 if(p.endsWith('/branding')){
  const avatarUrl='https://video-maker-every-thing.pages.dev/assets/telegram-avatar-v2.jpg';
  const image=await fetch(avatarUrl,{signal:AbortSignal.timeout(15000)});if(!image.ok||!(image.headers.get('Content-Type')||'').startsWith('image/jpeg'))fail(502,'Белый логотип ещё не опубликован');
  const bytes=await image.arrayBuffer();if(bytes.byteLength>2000000||bytes.byteLength<100)fail(502,'Проверьте файл аватара');
  const me=await bot(env,c,'getMe'),before=await bot(env,c,'getUserProfilePhotos',{user_id:me.id,limit:1});
  const form=new FormData();form.set('photo',JSON.stringify({type:'static',photo:'attach://avatar'}));form.set('avatar',new Blob([bytes],{type:'image/jpeg'}),'vmet-white.jpg');
  let result;try{const response=await fetch('https://api.telegram.org/bot'+await botToken(env,c)+'/setMyProfilePhoto',{method:'POST',body:form,signal:AbortSignal.timeout(20000)});result=await response.json();if(!response.ok||!result.ok)throw Error()}catch{fail(502,'Telegram не подтвердил обновление аватара')}
  const after=await bot(env,c,'getUserProfilePhotos',{user_id:me.id,limit:1});
  await st(env,'INSERT INTO audit VALUES(?,?,?,?,?,?)',crypto.randomUUID(),u.email,'telegram.avatar.update','main',JSON.stringify({previous_photo:before.photos?.[0]?.at(-1)?.file_id||null,photo:after.photos?.[0]?.at(-1)?.file_id||null,asset:avatarUrl}),now()).run();
  return out({ok:true,username:me.username,photoPresent:after.total_count>0,message:'Белый логотип установлен в Telegram'});
 }
 if(p.endsWith('/test')){const me=await bot(env,c,'getMe');await st(env,"UPDATE telegram_config SET username=? WHERE id='main'",me.username).run();const info=await bot(env,c,'getWebhookInfo');return out({ok:true,username:me.username,webhook:info.url,pending:info.pending_update_count,lastError:info.last_error_date?'Webhook требует проверки доставки':''})}
 if(p.endsWith('/connect')){if(!c.enabled||!c.app_url||!env.TELEGRAM_WEBHOOK_SECRET)fail(400,'Сохраните настройки и серверный секрет webhook');
  await bot(env,c,'setMyCommands',{commands:[{command:'start',description:'Открыть видеостудию'},{command:'studio',description:'Создать видео'},{command:'balance',description:'Баланс и подписка'},{command:'help',description:'Как пользоваться студией'}]});
  await bot(env,c,'setChatMenuButton',{menu_button:{type:'web_app',text:'Открыть студию',web_app:{url:c.app_url}}});
  await bot(env,c,'setWebhook',{url:new URL(req.url).origin+'/api/telegram/webhook',secret_token:env.TELEGRAM_WEBHOOK_SECRET,allowed_updates:['message'],drop_pending_updates:false});return out({ok:true})}
 if(p.endsWith('/disconnect')){await bot(env,c,'deleteWebhook',{drop_pending_updates:false});await st(env,"UPDATE telegram_config SET enabled=0 WHERE id='main'").run();return out({ok:true})}
 return out({error:'Маршрут не найден'},404);
}
