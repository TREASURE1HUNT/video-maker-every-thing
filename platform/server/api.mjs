import {speechRoutes} from './speech.mjs';
import {publicAuth,adminAuth,sessionUser} from './auth.mjs';
import {aiRoutes,aiReady,resolveSkill,executeAI,validateAIResult} from './ai.mjs';
import {account} from './account.mjs';
import {paymentAdmin,paymentKey,billing,requirePaid,requireModel,planCatalog} from './billing.mjs';
const now=()=>new Date().toISOString(), uid=()=>crypto.randomUUID();
const fail=(status,message)=>{throw Object.assign(new Error(message),{status})};
const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const str=(v,max=160)=>{if(typeof v!=='string'||!v.trim()||v.length>max)fail(400,'Проверьте обязательные поля');return v.trim()};
const num=(v,min=0,max=1000000)=>{if(!Number.isSafeInteger(v)||v<min||v>max)fail(400,'Число вне допустимого диапазона');return v};
const choice=(v,a)=>{if(!a.includes(v))fail(400,'Недопустимое значение');return v};
const date=v=>{const d=new Date(v);if(!Number.isFinite(+d))fail(400,'Некорректная дата');return d.toISOString()};
const digest=async s=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))).map(x=>x.toString(16).padStart(2,'0')).join('');
const secret=()=> 'vmet_'+Array.from(crypto.getRandomValues(new Uint8Array(32))).map(x=>x.toString(16).padStart(2,'0')).join('');
const stmt=(db,sql,...args)=>db.prepare(sql).bind(...args);
const all=async(db,sql,...args)=>(await stmt(db,sql,...args).all()).results;
const first=(db,sql,...args)=>stmt(db,sql,...args).first();
const audit=(db,actor,action,entity,details={})=>stmt(db,'INSERT INTO audit VALUES(?,?,?,?,?,?)',uid(),actor,action,entity,JSON.stringify(details),now());
const permissions={owner:['users','models','credits','tokens','promos','campaigns','audit','billing'],admin:['users','models','credits','tokens','promos','campaigns','audit','billing'],finance:['credits','promos','campaigns','audit','billing'],support:['tokens','audit'],user:[]};
async function identity(req,env){
 const local=await sessionUser(req,env);if(local){if(local.status!=='active')fail(403,'Аккаунт приостановлен');return local}
 const email=req.headers.get('oai-authenticated-user-email')?.toLowerCase();
 // Only trusted Sites ingress supplies identity; do not put this Worker behind an untrusted proxy.
 if(!email)fail(401,'Войдите в аккаунт');
 let user=await first(env.DB,'SELECT * FROM users WHERE email=?',email);
 if(!user&&env.ADMIN_EMAIL&&email===env.ADMIN_EMAIL.toLowerCase()){
  await stmt(env.DB,"INSERT OR IGNORE INTO users VALUES(?,?,?,'owner','active','free',0,'[\"*\"]',?)",uid(),email,'Владелец',now()).run();
  user=await first(env.DB,'SELECT * FROM users WHERE email=?',email);
 }
 if(!user){await stmt(env.DB,"INSERT OR IGNORE INTO users VALUES(?,?,?,'user','active','free',0,'[\"*\"]',?)",uid(),email,email.split('@')[0],now()).run();user=await first(env.DB,'SELECT * FROM users WHERE email=?',email)}
 if(!user||user.status!=='active')fail(403,'Доступ не выдан или приостановлен');
 return user;
}
async function tokenUser(req,env){
 const raw=req.headers.get('Authorization')?.replace(/^Bearer /,'');
 if(!raw?.startsWith('vmet_'))fail(401,'Нужен API-токен');
 const token=await first(env.DB,'SELECT * FROM tokens WHERE hash=?',await digest(raw));
 if(!token||token.revoked||token.expires_at<=now())fail(401,'Токен истёк или отозван');
 const user=await first(env.DB,'SELECT * FROM users WHERE id=?',token.user_id);
 if(!user||user.status!=='active')fail(403,'Аккаунт приостановлен');
 await stmt(env.DB,'UPDATE tokens SET last_used=? WHERE id=?',now(),token.id).run();
 return {user,token};
}
async function body(req){const text=await req.text();if(text.length>180000)fail(413,'Слишком большой запрос');try{return JSON.parse(text)}catch{fail(400,'Ожидается JSON')}}
async function adjust(db,user,amount,reason,actor){
 const id=uid();
 const result=await db.batch([
  stmt(db,'INSERT INTO ledger SELECT ?,id,?,?,?,? FROM users WHERE id=? AND credits+?>=0',id,amount,reason,actor,now(),user,amount),
  stmt(db,'UPDATE users SET credits=credits+? WHERE id=? AND EXISTS(SELECT 1 FROM ledger WHERE id=?)',amount,user,id),
  stmt(db,'INSERT INTO audit SELECT ?,?,?,?, ?,? WHERE EXISTS(SELECT 1 FROM ledger WHERE id=?)',uid(),actor,'credits.adjust',user,JSON.stringify({amount,reason}),now(),id)
 ]);
 if(!result[0].meta.changes)fail(409,'Пользователь не найден или недостаточно кредитов');
 return id;
}
async function redeem(db,user,code){
 const p=await first(db,'SELECT * FROM promos WHERE code=?',str(code,32).toUpperCase());if(!p)fail(404,'Промокод не найден');
 const id=uid(),t=now();
 const r=await db.batch([
  stmt(db,`INSERT OR IGNORE INTO redemptions SELECT ?,p.id,u.id,?,p.credits,? FROM promos p,users u WHERE p.id=? AND u.id=? AND u.status='active' AND p.active=1 AND p.starts_at<=? AND p.ends_at>? AND (p.plan='*' OR p.plan=u.plan) AND (SELECT count(*) FROM redemptions WHERE promo_id=p.id)<p.max_uses`,id,p.id+':'+user.id,t,p.id,user.id,t,t),
  stmt(db,'UPDATE users SET credits=credits+(SELECT credits FROM redemptions WHERE id=?) WHERE id=? AND EXISTS(SELECT 1 FROM redemptions WHERE id=?)',id,user.id,id),
  stmt(db,"INSERT INTO ledger SELECT id,user_id,credits,?, ?,created_at FROM redemptions WHERE id=?",'Промокод '+p.code,user.email,id),
  stmt(db,"INSERT INTO audit SELECT ?,?,'promo.redeem',promo_id,?,? FROM redemptions WHERE id=?",uid(),user.email,JSON.stringify({code:p.code,user:user.id}),t,id)
 ]);
 if(!r[0].meta.changes)fail(409,'Промокод уже использован, неактивен, исчерпан или не подходит тарифу');
 return {credits:p.credits};
}
async function gateway(req,env){
 const {user,token}=req.headers.has('Authorization')?await tokenUser(req,env):{user:await identity(req,env),token:null};if(token&&token.scope!=='ai:chat')fail(403,'Токен не разрешает запросы ИИ');
 await requirePaid(env.DB,user);const b=await body(req);await requireModel(env.DB,user,b.model);const model=await first(env.DB,'SELECT * FROM models WHERE id=? AND enabled=1',str(b.model));
 if(!model||model.provider!==b.provider)fail(403,'Модель выключена или провайдер не совпадает');
 const allowed=JSON.parse(user.models);if(!allowed.includes('*')&&!allowed.includes(model.id))fail(403,'Модель не разрешена пользователю');
 if(!await aiReady(env.DB,env,model))fail(503,'Провайдер ИИ ещё не подключён. Кредиты не списаны');
 const skill=await resolveSkill(env.DB,user,b.skill_id||b.settings?.skill_id);
 if(b.assets&&!Array.isArray(b.assets))fail(400,'Некорректный список материалов');
 if(!Array.isArray(b.messages)||b.messages.length>40||!b.messages.every(m=>['user','assistant'].includes(m.role)&&typeof m.content==='string'&&m.content.length<=14000))fail(400,'Некорректные сообщения');
 const key=str(req.headers.get('Idempotency-Key')||b.requestId,100),idem=user.id+':'+key;
 let prior=await first(env.DB,'SELECT * FROM requests WHERE idem=?',idem);
 if(prior){if(prior.status==='complete')return json(JSON.parse(prior.response));fail(409,'Этот запрос уже обрабатывался. Для новой попытки нужен новый идентификатор')}
 const id=uid(),t=now();
 const r=await env.DB.batch([
  stmt(env.DB,"INSERT OR IGNORE INTO requests SELECT ?,id,?,'reserved',?,NULL,? FROM users WHERE id=? AND credits>=? AND status='active'",id,idem,model.cost,t,user.id,model.cost),
  stmt(env.DB,'UPDATE users SET credits=credits-? WHERE id=? AND EXISTS(SELECT 1 FROM requests WHERE id=?)',model.cost,user.id,id),
  stmt(env.DB,'INSERT INTO ledger SELECT ?,user_id,?, ?,?,created_at FROM requests WHERE id=?',id,-model.cost,'ИИ: '+model.name,user.email,id)
 ]);
 if(!r[0].meta.changes)fail(409,'Недостаточно кредитов или повторный запрос');
 try{
  const data=validateAIResult(await executeAI(env,user,model,{...b,executionId:id},skill),b);
  await stmt(env.DB,"UPDATE requests SET status='complete',response=? WHERE id=?",JSON.stringify(data),id).run();return json(data);
 }catch{
  await env.DB.batch([
   stmt(env.DB,"INSERT OR IGNORE INTO ledger SELECT ? ,user_id,cost,'Возврат: ошибка ИИ',?,? FROM requests WHERE id=? AND status='reserved'",id+':refund',user.email,now(),id),
   stmt(env.DB,"UPDATE users SET credits=credits+? WHERE id=? AND EXISTS(SELECT 1 FROM requests WHERE id=? AND status='reserved')",model.cost,user.id,id),
   stmt(env.DB,"UPDATE requests SET status='failed' WHERE id=? AND status='reserved'",id)
  ]);fail(502,'ИИ-шлюз не ответил корректно. Кредиты возвращены');
 }
}
export async function api(req,env){
 try{
  if(!env.DB)fail(503,'База данных не подключена');
  const url=new URL(req.url),path=url.pathname;
  const authResult=await publicAuth(req,env);if(authResult)return authResult;
  if(req.method!=='GET'&&req.headers.get('Origin')&&req.headers.get('Origin')!==url.origin)fail(403,'Другой источник запроса');
  if(path==='/v1/chat'&&req.method==='POST')return await gateway(req,env);
  if(path==='/api/redeem'&&req.method==='POST'){const {user,token}=await tokenUser(req,env);if(token.scope!=='promo:redeem')fail(403,'Токен не разрешает активацию промокодов');return json(await redeem(env.DB,user,(await body(req)).code))}
  const u=await identity(req,env),perms=permissions[u.role]||[];const paymentResult=await paymentAdmin(req,env,u);if(paymentResult)return paymentResult;const authAdminResult=await adminAuth(req,env,u);if(authAdminResult)return authAdminResult;const speechResult=await speechRoutes(req,env,u);if(speechResult)return speechResult;const aiResult=await aiRoutes(req,env,u);if(aiResult)return aiResult;const accountResult=await account(req,env,u);if(accountResult)return accountResult;const customerResult=await billing(req,env,u);if(customerResult)return customerResult;
  if(path==='/api/me')return json({user:u,permissions:perms,gatewayConfigured:!!env.AI_GATEWAY_URL});
  if(!perms.length)fail(403,'Требуется роль администратора');
  const section=path.split('/')[3];
  if(req.method==='GET'&&path==='/api/admin/state'){
   const tables={};
   // Read visibility follows the same domain permissions as writes.
   const names=new Set(['users',...perms]);if(perms.includes('credits'))names.add('ledger');
   for(const name of names){if(name==='credits'||name==='billing')continue;
    tables[name]=await all(env.DB,name==='tokens'?'SELECT t.id,t.user_id,t.name,t.prefix,t.scope,t.expires_at,t.revoked,t.created_at,t.last_used,u.email FROM tokens t JOIN users u ON u.id=t.user_id ORDER BY t.created_at DESC LIMIT 500':name==='users'&&u.role!=='owner'&&u.role!=='admin'?'SELECT id,email,name,status,plan,credits FROM users ORDER BY created_at DESC LIMIT 500':`SELECT * FROM ${name} ORDER BY rowid DESC LIMIT 500`);
   }
   if(perms.includes('billing')){tables.plans=await planCatalog(env.DB);tables.subscriptions=await all(env.DB,'SELECT * FROM subscriptions');tables.orders=await all(env.DB,'SELECT * FROM orders ORDER BY created_at DESC LIMIT 100')}return json({tables,permissions:perms,user:u,gatewayConfigured:!!env.AI_GATEWAY_URL,paymentConfigured:!!await paymentKey(env),limit:500});
  }
  if(!perms.includes(section))fail(403,'Эта операция не разрешена вашей роли');
  if(req.method!=='POST')fail(405,'Ожидается POST');
  const b=await body(req),db=env.DB,actor=u.email,id=b.id||uid();
  if(section==='users'){
   const email=str(b.email).toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))fail(400,'Некорректный email');
   const existing=await first(db,'SELECT * FROM users WHERE id=?',id);
   const role=choice(b.role,['user','support','finance','admin']);
   if(existing?.role==='owner'||(email===env.ADMIN_EMAIL?.toLowerCase()))fail(403,'Владелец защищён от изменений');
   if(u.role!=='owner'&&(role==='admin'||existing?.role==='admin'))fail(403,'Только владелец управляет администраторами');
   const access=Array.isArray(b.models)&&b.models.length<100&&b.models.every(x=>typeof x==='string'&&x.length<100)?b.models:fail(400,'Некорректный список моделей');
   await db.batch([stmt(db,`INSERT INTO users VALUES(?,?,?,?,?,?,0,?,?) ON CONFLICT(id) DO UPDATE SET email=excluded.email,name=excluded.name,role=excluded.role,status=excluded.status,plan=excluded.plan,models=excluded.models`,id,email,str(b.name),role,choice(b.status,['active','suspended']),choice(b.plan,['free','lite','plus','pro']),JSON.stringify(access),now()),audit(db,actor,'users.save',id,{email,role,status:b.status})]);
  }else if(section==='models'){
   if(!/^[a-zA-Z0-9._:/-]{1,100}$/.test(id))fail(400,'Недопустимый ID модели');
   await db.batch([stmt(db,'INSERT INTO models VALUES(?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET provider=excluded.provider,name=excluded.name,enabled=excluded.enabled,cost=excluded.cost,description=excluded.description,min_plan=excluded.min_plan',id,choice(b.provider,['openai','anthropic','google','custom']),str(b.name),b.enabled?1:0,num(b.cost,0,10000),String(b.description||'').slice(0,500),choice(b.min_plan||'lite',['lite','plus','pro'])),audit(db,actor,'models.save',id,{enabled:!!b.enabled,cost:b.cost})]);
  }else if(section==='credits'){
   await adjust(db,str(b.user_id),num(b.amount,-1000000,1000000),str(b.reason,500),actor);
  }else if(section==='tokens'){
   if(b.action==='revoke'){await db.batch([stmt(db,'UPDATE tokens SET revoked=1 WHERE id=?',str(b.id)),audit(db,actor,'tokens.revoke',id)]);}
   else{
    if(!await first(db,'SELECT id FROM users WHERE id=?',str(b.user_id)))fail(404,'Пользователь не найден');
    const expires=date(b.expires_at);if(expires<=now()||+new Date(expires)>Date.now()+366*86400000)fail(400,'Срок токена: от текущего момента до 366 дней');
    const raw=secret();await db.batch([stmt(db,'INSERT INTO tokens VALUES(?,?,?,?,?,?,?,0,?,NULL)',id,b.user_id,str(b.name),raw.slice(0,13),await digest(raw),choice(b.scope,['ai:chat','promo:redeem']),expires,now()),audit(db,actor,'tokens.create',id,{user:b.user_id,scope:b.scope})]);return json({ok:true,token:raw});
   }
  }else if(section==='promos'){
   const code=str(b.code,32).toUpperCase();if(!/^[A-Z0-9_-]+$/.test(code))fail(400,'Промокод: A–Z, 0–9, _ и -');
   const start=date(b.starts_at),end=date(b.ends_at);if(start>=end)fail(400,'Дата окончания должна быть позже начала');
   const existing=await first(db,'SELECT * FROM promos WHERE id=?',id);
   // Existing redemptions must remain immutable; editing a used promotion only toggles its availability.
   if(existing&&await first(db,'SELECT id FROM redemptions WHERE promo_id=? LIMIT 1',id)){
    await db.batch([stmt(db,'UPDATE promos SET active=? WHERE id=?',b.active?1:0,id),audit(db,actor,'promos.toggle',id,{active:!!b.active})]);
   }else await db.batch([stmt(db,'INSERT INTO promos VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET code=excluded.code,credits=excluded.credits,max_uses=excluded.max_uses,starts_at=excluded.starts_at,ends_at=excluded.ends_at,active=excluded.active,plan=excluded.plan',id,code,num(b.credits,1),num(b.max_uses,1),start,end,b.active?1:0,choice(b.plan,['*','free','lite','plus','pro'])),audit(db,actor,'promos.save',id,{code})]);
  }else if(section==='campaigns'){
   const start=date(b.starts_at),end=date(b.ends_at);if(start>=end)fail(400,'Дата окончания должна быть позже начала');
   await db.batch([stmt(db,'INSERT INTO campaigns VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,description=excluded.description,starts_at=excluded.starts_at,ends_at=excluded.ends_at,active=excluded.active,audience=excluded.audience,promo_code=excluded.promo_code',id,str(b.name),str(b.description,1000),start,end,b.active?1:0,choice(b.audience,['all','free','lite','plus','pro']),String(b.promo_code||'').slice(0,32)),audit(db,actor,'campaigns.save',id)]);
  }else fail(404,'Маршрут не найден');
  return json({ok:true,id});
 }catch(e){if(!e.status)console.error('ADMIN_API_ERROR',e.message);return json({error:e.status?e.message:'Ошибка базы данных. Проверьте уникальность email, кода и идентификаторов.'},e.status||500)}
}


