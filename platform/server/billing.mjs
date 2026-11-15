import {seal,unseal,aiReady} from './ai.mjs';
import {getProfile} from './account.mjs';
export const PLAN_DEFAULTS=[{id:'lite',price_minor:79000,credits:100,enabled:1,video_limit:5,period_days:14},{id:'plus',price_minor:169000,credits:350,enabled:1,video_limit:7,period_days:7},{id:'pro',price_minor:349000,credits:1000,enabled:1,video_limit:10,period_days:7}];
const ranks={free:0,lite:1,plus:2,pro:3};
const now=()=>new Date().toISOString();const id=()=>crypto.randomUUID();
const fail=(status,message)=>{throw Object.assign(new Error(message),{status})};
const st=(db,sql,...a)=>db.prepare(sql).bind(...a),one=(db,sql,...a)=>st(db,sql,...a).first();
const rows=async(db,sql,...a)=>(await st(db,sql,...a).all()).results;
const out=x=>Response.json(x,{headers:{'Cache-Control':'no-store'}});
async function payload(req){const s=await req.text();if(s.length>20000)fail(413,'Запрос слишком большой');try{return JSON.parse(s)}catch{fail(400,'Ожидается JSON')}}
const audit=(db,u,action,target,details={})=>st(db,'INSERT INTO audit VALUES(?,?,?,?,?,?)',id(),u.email,action,target,JSON.stringify(details),now());
export async function planCatalog(db){const overrides=await rows(db,'SELECT * FROM plans');return PLAN_DEFAULTS.map(p=>({...p,...overrides.find(x=>x.id===p.id)}))}
export async function entitlement(db,u){const sub=await one(db,'SELECT * FROM subscriptions WHERE user_id=?',u.id);const active=u.status==='active'&&sub&&ranks[sub.plan]>0&&sub.starts_at<=now()&&sub.ends_at>now();const plan=PLAN_DEFAULTS.find(p=>p.id===sub?.plan);const used=active?(await one(db,'SELECT count(*) n FROM cloud_projects WHERE user_id=? AND created_at>?',u.id,new Date(Date.now()-plan.period_days*86400000).toISOString())).n:0;return{plan:active?sub.plan:'free',canCreate:!!active,endsAt:active?sub.ends_at:null,credits:u.credits,videoLimit:active?plan.video_limit:0,periodDays:active?plan.period_days:0,videosUsed:used,videosRemaining:active?Math.max(0,plan.video_limit-used):0}}
export async function requirePaid(db,u){const e=await entitlement(db,u);if(!e.canCreate)fail(402,'Для создания нужна действующая подписка Lite, Plus или Pro');return e}
export async function availableModels(db,u,e){const allow=JSON.parse(u.models);return (await rows(db,'SELECT id,provider,name,cost,description,min_plan FROM models WHERE enabled=1')).map(m=>({...m,available:e.canCreate&&ranks[e.plan]>=ranks[m.min_plan]&&(allow.includes('*')||allow.includes(m.id))}))}
export async function requireModel(db,u,modelId){const e=await requirePaid(db,u);if(modelId==='local')return e;const m=(await availableModels(db,u,e)).find(m=>m.id===modelId);if(!m?.available)fail(403,'Модель недоступна на вашей подписке');return e}
async function provider(env,path,method='GET',data){const key=await paymentKey(env);if(!key)fail(503,'Оплата ещё не подключена: нужен ключ NOWPayments');const r=await fetch('https://api.nowpayments.io/v1'+path,{method,headers:{'x-api-key':key,'Content-Type':'application/json'},...(data?{body:JSON.stringify(data)}:{}),signal:AbortSignal.timeout(14000)});if(!r.ok)fail(502,'Платёжный сервис отклонил запрос. Попробуйте позже');return r.json()}
const decimals=v=>{const s=String(v);if(!/^\d+(\.\d{1,18})?$/.test(s))return null;const [a,b='']=s.split('.');return BigInt(a)*10n**18n+BigInt(b.padEnd(18,'0'))};
export function validatesPayment(o,p){const paid=decimals(p.actually_paid),expected=decimals(o.pay_amount);return p.payment_status==='finished'&&String(p.payment_id)===o.payment_id&&p.order_id===o.id&&p.price_currency?.toLowerCase()===(o.price_currency||'usd')&&Math.round(Number(p.price_amount)*100)===o.price_minor&&p.pay_currency===o.pay_currency&&decimals(p.pay_amount)===expected&&expected>0n&&paid!==null&&paid>=expected}
async function activate(db,u,o){
 // One atomic batch. All fulfillment statements key off the same unactivated order.
 await db.batch([
 st(db,`INSERT INTO subscriptions SELECT user_id,plan,?,strftime('%Y-%m-%dT%H:%M:%fZ',CASE WHEN (SELECT ends_at FROM subscriptions WHERE user_id=orders.user_id)>? THEN (SELECT ends_at FROM subscriptions WHERE user_id=orders.user_id) ELSE ? END,'+30 days'),id FROM orders WHERE id=? AND activated_at IS NULL ON CONFLICT(user_id) DO UPDATE SET plan=excluded.plan,starts_at=excluded.starts_at,ends_at=excluded.ends_at,source=excluded.source`,now(),now(),now(),o.id),
 st(db,'INSERT OR IGNORE INTO ledger SELECT id,user_id,credits,?, ?,? FROM orders WHERE id=? AND activated_at IS NULL','Подписка '+o.plan,u.email,now(),o.id),
 st(db,'UPDATE users SET credits=credits+?,plan=? WHERE id=? AND EXISTS(SELECT 1 FROM orders WHERE id=? AND activated_at IS NULL)',o.credits,o.plan,u.id,o.id),
 st(db,"INSERT INTO audit SELECT ?,?,'billing.paid',id,?,? FROM orders WHERE id=? AND activated_at IS NULL",id(),u.email,JSON.stringify({plan:o.plan,price_minor:o.price_minor}),now(),o.id),
 st(db,"UPDATE orders SET status='finished',activated_at=? WHERE id=? AND activated_at IS NULL",now(),o.id)
 ]);
}
export async function billing(req,env,u){const url=new URL(req.url),p=url.pathname,db=env.DB;
 if(p==='/api/customer'&&req.method==='GET'){const e=await entitlement(db,u);return out({user:{id:u.id,email:u.email,name:u.name,role:u.role},profile:await getProfile(db,u),...e,models:await Promise.all((await availableModels(db,u,e)).map(async m=>{const connected=await aiReady(db,env,m);const reason=!e.canCreate?'Нужна действующая подписка':ranks[e.plan]<ranks[m.min_plan]?'Доступна с подпиской '+m.min_plan:!m.available?'Доступ ограничен администратором':!connected?'Администратор ещё не подключил API-ключ':'';return {...m,available:m.available&&connected,reason}})),plans:await planCatalog(db),paymentReady:!!await paymentKey(env),priceCurrency:'RUB',aiReady:!!env.AI_GATEWAY_URL||!!env.OPENROUTER_API_KEY})}
 if(p==='/api/projects'&&req.method==='POST'){const b=await payload(req);if(typeof b.name!=='string'||!b.name.trim()||b.name.length>70)fail(400,'Нужно название проекта');const e=await requireModel(db,u,b.model_id||'local'),cutoff=new Date(Date.now()-e.periodDays*86400000).toISOString(),projectId=id();const result=await db.batch([st(db,"INSERT INTO cloud_projects SELECT ?,id,?,?,? FROM users WHERE id=? AND status='active' AND (SELECT count(*) FROM cloud_projects WHERE user_id=? AND created_at>?)<? AND EXISTS(SELECT 1 FROM subscriptions WHERE user_id=? AND starts_at<=? AND ends_at>?)",projectId,b.name,b.model_id||'local',now(),u.id,u.id,cutoff,e.videoLimit,u.id,now(),now()),st(db,"INSERT INTO audit SELECT ?,?,'project.create',id,'{}',? FROM cloud_projects WHERE id=?",id(),u.email,now(),projectId)]);if(!result[0].meta.changes)fail(429,'Лимит видео на текущий период исчерпан');return out({projectId})}
 if(p==='/api/billing/checkout'&&req.method==='POST'){
  const b=await payload(req),plan=(await planCatalog(db)).find(x=>x.id===b.plan&&x.enabled);if(!plan||plan.price_minor<100)fail(400,'Тариф не продаётся');
  if(!await paymentKey(env))fail(503,'Оплата ещё не подключена: нужен ключ NOWPayments');
  const open=await one(db,"SELECT * FROM orders WHERE user_id=? AND status='waiting' AND plan=? AND created_at>? ORDER BY created_at DESC LIMIT 1",u.id,plan.id,new Date(Date.now()-30*60000).toISOString());if(open)return out({order:open});
  if(await one(db,"SELECT id FROM orders WHERE user_id=? AND status='creating' AND created_at>? LIMIT 1",u.id,new Date(Date.now()-60000).toISOString()))fail(409,'Счёт уже создаётся. Подождите минуту');
  const currencies=await provider(env,'/currencies');if(!currencies.currencies?.includes('usdttrc20'))fail(503,'USDT в сети TRON сейчас недоступен');
  const orderId=id();await st(db,"INSERT INTO orders (id,user_id,plan,price_minor,credits,status,payment_id,pay_amount,pay_address,pay_currency,created_at,activated_at,last_checked,price_currency) VALUES(?,?,?,?,?,'creating',NULL,NULL,NULL,NULL,?,NULL,NULL,'rub')",orderId,u.id,plan.id,plan.price_minor,plan.credits,now()).run();
  try{const payment=await provider(env,'/payment','POST',{price_amount:plan.price_minor/100,price_currency:'rub',pay_currency:'usdttrc20',order_id:orderId,order_description:'VMET '+plan.id+' / 30 days'});
   if(!payment.payment_id||typeof payment.pay_address!=='string'||!payment.pay_address||payment.pay_currency!=='usdttrc20'||decimals(payment.pay_amount)===null||decimals(payment.pay_amount)<=0n)fail(502,'Провайдер вернул некорректный счёт');
   await st(db,"UPDATE orders SET status='waiting',payment_id=?,pay_amount=?,pay_address=?,pay_currency=? WHERE id=?",String(payment.payment_id),String(payment.pay_amount),payment.pay_address,payment.pay_currency,orderId).run();return out({order:await one(db,'SELECT * FROM orders WHERE id=?',orderId)});
  }catch(e){await st(db,"UPDATE orders SET status='unknown' WHERE id=?",orderId).run();throw e}
 }
 if(p==='/api/billing/check'&&req.method==='POST'){
  const b=await payload(req),o=await one(db,'SELECT * FROM orders WHERE id=? AND user_id=?',String(b.order_id||''),u.id);if(!o)fail(404,'Счёт не найден');
  if(o.activated_at)return out({status:'finished',activated:true});if(!o.payment_id)fail(409,'Счёт требует проверки администратором');
  if(o.last_checked&&Date.now()-Date.parse(o.last_checked)<10000)return out({status:o.status,activated:false,retryAfter:10});await st(db,'UPDATE orders SET last_checked=? WHERE id=?',now(),o.id).run();
  const payment=await provider(env,'/payment/'+encodeURIComponent(o.payment_id));
  if(validatesPayment(o,payment)){await activate(db,u,o);return out({status:'finished',activated:true})}
  const status=['waiting','confirming','confirmed','sending','partially_paid','failed','refunded','expired'].includes(payment.payment_status)?payment.payment_status:'review';await st(db,'UPDATE orders SET status=? WHERE id=?',status,o.id).run();return out({status,activated:false});
 }
 if(p==='/api/billing/orders'&&req.method==='GET')return out({orders:await rows(db,'SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC LIMIT 20',u.id)});
 if(p==='/api/admin/billing'&&req.method==='POST'){
  if(!['owner','admin','finance'].includes(u.role))fail(403,'Доступ не выдан');const b=await payload(req);
  if(b.action==='plan'){
   if(!PLAN_DEFAULTS.some(x=>x.id===b.plan)||!Number.isSafeInteger(b.price_minor)||b.price_minor<100||b.price_minor>10000000||!Number.isSafeInteger(b.credits)||b.credits<0||b.credits>1000000)fail(400,'Проверьте цену и кредиты');
   await db.batch([st(db,'INSERT INTO plans VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET price_minor=excluded.price_minor,credits=excluded.credits,enabled=excluded.enabled',b.plan,b.price_minor,b.credits,b.enabled?1:0),audit(db,u,'billing.plan',b.plan,{price_minor:b.price_minor,credits:b.credits})]);return out({ok:true});
  }
  if(!['owner','admin'].includes(u.role))fail(403,'Выдавать доступ может владелец или администратор');
  if(typeof b.reason!=='string'||!b.reason.trim()||b.reason.length>500)fail(400,'Укажите основание выдачи');
  const target=await one(db,'SELECT * FROM users WHERE id=?',String(b.user_id||''));if(!target)fail(404,'Пользователь не найден');
  if(b.action==='revoke'){await db.batch([st(db,'DELETE FROM subscriptions WHERE user_id=?',target.id),st(db,"UPDATE users SET plan='free' WHERE id=?",target.id),audit(db,u,'billing.revoke',target.id,{reason:b.reason})]);return out({ok:true})}
  if(!PLAN_DEFAULTS.some(x=>x.id===b.plan)||!Number.isSafeInteger(b.days)||b.days<1||b.days>366)fail(400,'Тариф и срок обязательны');
  await db.batch([st(db,'INSERT INTO subscriptions VALUES(?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET plan=excluded.plan,starts_at=excluded.starts_at,ends_at=excluded.ends_at,source=excluded.source',target.id,b.plan,now(),new Date(Date.now()+b.days*86400000).toISOString(),'admin'),st(db,'UPDATE users SET plan=? WHERE id=?',b.plan,target.id),audit(db,u,'billing.grant',target.id,{plan:b.plan,days:b.days,reason:b.reason})]);return out({ok:true});
 }
 return null;
}

export async function paymentKey(env){const c=await one(env.DB,'SELECT * FROM payment_config WHERE id=?','main');return c?(c.enabled&&c.secret?unseal(c.secret,env,'billing:nowpayments'):''):env.NOWPAYMENTS_API_KEY||''}
export async function paymentAdmin(req,env,u){const p=new URL(req.url).pathname;if(!p.startsWith('/api/admin/payment/'))return null;if(u.role!=='owner')fail(403,'Настройки оплаты доступны владельцу');const c=await one(env.DB,'SELECT * FROM payment_config WHERE id=?','main');if(req.method==='GET'&&p.endsWith('/settings'))return out({enabled:!!c?.enabled,has_key:!!c?.secret||!!env.NOWPAYMENTS_API_KEY,vaultReady:!!env.AI_CONFIG_KEY,currency:'RUB'});if(req.method!=='POST')fail(405,'Ожидается POST');const b=await payload(req);if(p.endsWith('/settings')){let secret=c?.secret||'';if(b.clear_key)secret='';else if(b.api_key){if(typeof b.api_key!=='string'||b.api_key.length>4000)fail(400,'Проверьте ключ');secret=await seal(b.api_key.trim(),env,'billing:nowpayments')}if(b.enabled&&!secret&&!env.NOWPAYMENTS_API_KEY)fail(400,'Сначала добавьте API-ключ');await dbSave();async function dbSave(){await env.DB.batch([st(env.DB,'INSERT INTO payment_config VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET secret=excluded.secret,enabled=excluded.enabled,updated_at=excluded.updated_at','main',secret,b.enabled?1:0,now()),audit(env.DB,u,'billing.connection.save','main')])}return out({ok:true})}if(p.endsWith('/test')){const r=await provider(env,'/currencies');if(!r.currencies?.includes('usdttrc20'))fail(502,'Сеть USDT TRC20 недоступна');return out({ok:true,message:'Ключ принят. USDT TRC20 доступен. Тест не создавал платёж.'})}fail(404,'Маршрут не найден')}


