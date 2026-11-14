const now=()=>new Date().toISOString();
const fail=(status,message)=>{throw Object.assign(new Error(message),{status})};
const st=(db,sql,...a)=>db.prepare(sql).bind(...a),first=(db,sql,...a)=>st(db,sql,...a).first();
const rows=async(db,sql,...a)=>(await st(db,sql,...a).all()).results;
const json=data=>Response.json(data,{headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export async function getProfile(db,u){return await first(db,'SELECT timezone,default_model,updated_at FROM profiles WHERE user_id=?',u.id)||{timezone:'UTC',default_model:'local',updated_at:null}}
async function body(req){const s=await req.text();if(s.length>8000)fail(413,'Слишком большой запрос');try{return JSON.parse(s)}catch{fail(400,'Нужен JSON')}}
const log=(db,u,action,details={})=>st(db,'INSERT INTO audit VALUES(?,?,?,?,?,?)',crypto.randomUUID(),u.email,action,u.id,JSON.stringify(details),now());
export async function account(req,env,u){const path=new URL(req.url).pathname,db=env.DB;
 if(path==='/api/account'&&req.method==='GET')return json({user:{id:u.id,name:u.name,email:u.email,role:u.role,createdAt:u.created_at},profile:await getProfile(db,u),tokens:await rows(db,'SELECT id,name,prefix,scope,expires_at,revoked,last_used FROM tokens WHERE user_id=? ORDER BY created_at DESC LIMIT 50',u.id),ledger:await rows(db,'SELECT amount,reason,created_at FROM ledger WHERE user_id=? ORDER BY created_at DESC LIMIT 30',u.id),recentProjects:await rows(db,'SELECT id,name,model_id,created_at FROM cloud_projects WHERE user_id=? ORDER BY created_at DESC LIMIT 20',u.id)});
 if(path==='/api/account/profile'&&req.method==='POST'){
  const b=await body(req);if(Object.keys(b).some(k=>!['name','timezone','default_model'].includes(k)))fail(400,'Изменять email, роль, баланс или тариф через профиль запрещено');
  if(typeof b.name!=='string'||!b.name.trim()||b.name.trim().length>70)fail(400,'Имя должно содержать от 1 до 70 символов');
  if(typeof b.timezone!=='string'||b.timezone.length>80)fail(400,'Выберите часовой пояс');try{new Intl.DateTimeFormat('ru-RU',{timeZone:b.timezone}).format()}catch{fail(400,'Часовой пояс не найден. Используйте IANA, например Europe/Moscow')}
  if(typeof b.default_model!=='string'||b.default_model.length>100)fail(400,'Выберите модель');
  if(b.default_model!=='local'&&!await first(db,'SELECT id FROM models WHERE id=? AND enabled=1',b.default_model))fail(400,'Модель выключена или не существует');
  await db.batch([st(db,'UPDATE users SET name=? WHERE id=?',b.name.trim(),u.id),st(db,'INSERT INTO profiles VALUES(?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET timezone=excluded.timezone,default_model=excluded.default_model,updated_at=excluded.updated_at',u.id,b.timezone,b.default_model,now()),log(db,u,'account.profile')]);
  return json({ok:true,name:b.name.trim(),profile:await getProfile(db,u)});
 }
 if(path==='/api/account/revoke-token'&&req.method==='POST'){
  const b=await body(req),t=await first(db,'SELECT id FROM tokens WHERE id=? AND user_id=?',String(b.id||''),u.id);if(!t)fail(404,'Токен не найден');
  await db.batch([st(db,'UPDATE tokens SET revoked=1 WHERE id=? AND user_id=?',t.id,u.id),log(db,u,'account.token.revoke',{token:t.id})]);return json({ok:true});
 }
 if(path==='/api/account/export'&&req.method==='GET')return json({exportedAt:now(),aiPreferences:JSON.parse((await first(db,'SELECT value FROM ai_preferences WHERE user_id=?',u.id))?.value||'{}'),user:{id:u.id,name:u.name,email:u.email,createdAt:u.created_at},profile:await getProfile(db,u),subscription:await first(db,'SELECT plan,starts_at,ends_at,source FROM subscriptions WHERE user_id=?',u.id),orders:await rows(db,'SELECT id,plan,price_minor,status,created_at,activated_at FROM orders WHERE user_id=? ORDER BY created_at DESC LIMIT 200',u.id),ledger:await rows(db,'SELECT amount,reason,created_at FROM ledger WHERE user_id=? ORDER BY created_at DESC LIMIT 500',u.id),projectRegistrations:await rows(db,'SELECT id,name,model_id,created_at FROM cloud_projects WHERE user_id=? ORDER BY created_at DESC LIMIT 500',u.id),note:'Медиа, монтажные JSON и локальные контрольные точки хранятся отдельно в браузере. Выгрузка ограничена последними записями.'});
 if(path==='/api/account/deactivate'&&req.method==='POST'){
  if(u.role==='owner')fail(403,'Владельца проекта можно отключить только после передачи владения через настройки хостинга');const b=await body(req);if(b.confirm!==u.email)fail(400,'Для подтверждения введите email аккаунта');
  if(await first(db,"SELECT id FROM orders WHERE user_id=? AND activated_at IS NULL AND status IN ('creating','unknown','waiting','confirming','confirmed','sending','partially_paid','review') LIMIT 1",u.id))fail(409,'Есть незавершённые платежи. Сначала завершите их проверку через администратора');
  await db.batch([st(db,"UPDATE users SET status='suspended' WHERE id=?",u.id),st(db,'UPDATE tokens SET revoked=1 WHERE user_id=?',u.id),st(db,'DELETE FROM subscriptions WHERE user_id=?',u.id),log(db,u,'account.deactivate')]);return json({ok:true,status:'suspended'});
 }
 return null;
}
