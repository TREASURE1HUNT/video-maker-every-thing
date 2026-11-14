import {test} from 'node:test';import assert from 'node:assert/strict';import 'fake-indexeddb/auto';
import {read,put,projects,saveProject,blankProject,TEMPLATES} from '../dist/project-store.js';
test('multiple projects, revision conflicts, legacy migration, archive and checkpoints',async()=>{
 const p=blankProject({name:'One'}),q=blankProject({name:'Two'});assert.notEqual(p.projectId,q.projectId);await put('project:'+p.projectId,p);await put('project:'+q.projectId,q);
 const next=await saveProject({...p,name:'Changed'});assert.equal(next.revision,1);await assert.rejects(()=>saveProject({...p,name:'Stale'}),/другой вкладке/);assert.equal((await read('project:'+p.projectId)).name,'Changed');
 await put('project:'+q.projectId,{...q,archived:true});assert.equal((await projects()).length,2);
 await put('current',{version:1,name:'Legacy',clips:[]});const listed=await projects();assert.equal(listed.length,3);assert.ok(listed.some(x=>x.projectId==='legacy-first'));assert.equal((await projects()).length,3);
 await put('checkpoint:one',{checkpointId:'cp',projectId:p.projectId,snapshot:next});assert.equal((await projects()).length,3);assert.equal((await read('checkpoint:one')).snapshot.name,'Changed');
 assert.equal(TEMPLATES.length,6);assert.ok(TEMPLATES.every(t=>['9:16','16:9','1:1'].includes(t.aspect)&&t.brief.length>30));
});
