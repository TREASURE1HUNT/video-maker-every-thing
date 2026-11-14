import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
export function database(file=':memory:'){
 const raw=new DatabaseSync(file);raw.exec('PRAGMA foreign_keys=ON');
 const applied=raw.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
 if(!applied)for(const name of readdirSync('drizzle').filter(n=>n.endsWith('.sql')).sort())raw.exec(readFileSync('drizzle/'+name,'utf8'));
 class Statement{constructor(sql,args=[]){this.sql=sql;this.args=args}bind(...args){return new Statement(this.sql,args)}async first(){return raw.prepare(this.sql).get(...this.args)||null}async all(){return{results:raw.prepare(this.sql).all(...this.args)}}async run(){const r=raw.prepare(this.sql).run(...this.args);return{meta:{changes:Number(r.changes)}}}}
 return{raw,prepare:s=>new Statement(s),async batch(list){raw.exec('BEGIN IMMEDIATE');try{const result=[];for(const s of list){const r=raw.prepare(s.sql).run(...s.args);result.push({meta:{changes:Number(r.changes)}})}raw.exec('COMMIT');return result}catch(e){raw.exec('ROLLBACK');throw e}}};
}
