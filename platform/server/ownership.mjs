const st=(db,q,...a)=>db.prepare(q).bind(...a);
const pending=new WeakMap();
// Only the hosting control plane can designate an owner. No HTTP field is accepted.
export async function reconcileOwner(env){
 const mail=String(env.OWNER_ACCOUNT_EMAIL||'').toLowerCase().trim();if(!mail||!env.DB)return;
 if(mail!==String(env.ADMIN_EMAIL||'').toLowerCase().trim())throw Object.assign(Error('Настройки владельца не согласованы'),{status:503});
 const rev=String(env.OWNER_TRANSFER_REVISION||mail),cached=pending.get(env.DB);if(cached?.key===mail+rev)return cached.promise;
 const promise=transfer(env,mail,rev);pending.set(env.DB,{key:mail+rev,promise});try{return await promise}catch(e){pending.delete(env.DB);throw e}
}
async function transfer(env,mail,revision){
 const db=env.DB,target=await st(db,`SELECT u.* FROM users u WHERE u.email=? AND u.status='active' AND (EXISTS(SELECT 1 FROM auth_identities i WHERE i.user_id=u.id AND i.provider='yandex') OR EXISTS(SELECT 1 FROM audit a WHERE a.entity=u.id AND a.action='owner.transfer.revoke'))`,mail).first();
 if(!target)throw Object.assign(Error('Новый владелец должен войти через Яндекс ID'),{status:503});
 const old=(await st(db,"SELECT id,email FROM users WHERE role='owner' AND id<>?",target.id).all()).results;
 if(target.role==='owner'&&!old.length)return;
 const at=new Date().toISOString(),key='owner-transfer:'+revision;
 await db.batch([
  ...old.map(u=>st(db,'INSERT OR IGNORE INTO audit VALUES(?,?,?,?,?,?)',key+':'+u.id,'hosting-control','owner.transfer.revoke',u.id,JSON.stringify({to:target.id,previousRole:'owner'}),at)),
  st(db,"DELETE FROM auth_sessions WHERE user_id IN (SELECT id FROM users WHERE role='owner' AND id<>?)",target.id),
  st(db,"UPDATE tokens SET revoked=1 WHERE user_id IN (SELECT id FROM users WHERE role='owner' AND id<>?)",target.id),
  st(db,"UPDATE users SET role='user' WHERE role='owner' AND id<>?",target.id),
  st(db,"UPDATE users SET role='owner' WHERE id=? AND status='active'",target.id),
  st(db,'INSERT OR IGNORE INTO audit VALUES(?,?,?,?,?,?)',key+':claim','hosting-control','owner.transfer.claim',target.id,JSON.stringify({email:mail,previousRole:target.role}),at)
 ]);
}
