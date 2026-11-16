const st=(db,q,...a)=>db.prepare(q).bind(...a),one=(db,q,...a)=>st(db,q,...a).first();
const WEEK=7*86400000;
export async function refreshCredits(db,u,at=Date.now()){
 const sub=await one(db,'SELECT * FROM subscriptions WHERE user_id=?',u.id),active=u.status==='active'&&sub&&['lite','plus','pro'].includes(sub.plan)&&Date.parse(sub.starts_at)<=at&&Date.parse(sub.ends_at)>at;
 const config=active?await one(db,'SELECT credits FROM plans WHERE id=?',sub.plan):null,cap=active?(config?.credits??({lite:100,plus:350,pro:1000}[sub.plan])):0,index=active?Math.max(0,Math.floor((at-Date.parse(sub.starts_at))/WEEK)):0;
 const key=active?sub.starts_at+':'+sub.plan+':'+cap+':'+index:'free',next=active?new Date(Math.min(Date.parse(sub.ends_at),Date.parse(sub.starts_at)+(index+1)*WEEK)).toISOString():null;
 let w=await one(db,'SELECT * FROM credit_wallets WHERE user_id=?',u.id);
 if(!w){const balance=(await one(db,'SELECT credits FROM users WHERE id=?',u.id)).credits;await st(db,'INSERT OR IGNORE INTO credit_wallets VALUES(?,?,?,?,?)',u.id,active&&balance===0?'initial':key,active?Math.min(balance,cap):0,cap,next).run();w=await one(db,'SELECT * FROM credit_wallets WHERE user_id=?',u.id)}
 if(w.cycle_key!==key){const delta=cap-w.included_remaining,entry='weekly:'+u.id+':'+key,t=new Date(at).toISOString();await db.batch([
 st(db,"INSERT OR IGNORE INTO ledger SELECT ?,user_id,?,'Недельные кредиты: обновление лимита','system',? FROM credit_wallets WHERE user_id=? AND cycle_key=?",entry,delta,t,u.id,w.cycle_key),
 st(db,'UPDATE users SET credits=credits+? WHERE id=? AND EXISTS(SELECT 1 FROM credit_wallets WHERE user_id=? AND cycle_key=?) AND EXISTS(SELECT 1 FROM ledger WHERE id=?)',delta,u.id,u.id,w.cycle_key,entry),
 st(db,'UPDATE credit_wallets SET cycle_key=?,included_remaining=?,allowance=?,next_refill_at=? WHERE user_id=? AND cycle_key=? AND EXISTS(SELECT 1 FROM ledger WHERE id=?)',key,cap,cap,next,u.id,w.cycle_key,entry)
 ])}
 u.credits=(await one(db,'SELECT credits FROM users WHERE id=?',u.id)).credits;return walletView(db,u);
}
export async function walletView(db,u){const w=await one(db,'SELECT * FROM credit_wallets WHERE user_id=?',u.id);return{included:w?.included_remaining||0,permanent:Math.max(0,u.credits-(w?.included_remaining||0)),weeklyLimit:w?.allowance||0,nextRefillAt:w?.next_refill_at||null}}
