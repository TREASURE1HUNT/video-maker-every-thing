import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {TEMPLATES} from '../dist/template-catalog.js';
const local=p=>new URL('../dist/'+p,import.meta.url);
test('six produced templates ship distinct posters, export covers, video and editable raw media',()=>{
 assert.equal(TEMPLATES.length,6);
 for(const t of TEMPLATES){
  for(const file of [t.preview,t.poster,t.cover,...t.sourceMedia.map(s=>s.url),...(t.audioFile?[t.audioFile]:[])])assert.ok(fs.statSync(local(file)).size>1024,file);
  assert.equal(t.editableSegments.length,3);
  let duration=0;
  for(const s of t.editableSegments){const raw=t.sourceMedia.find(x=>x.id===s.sourceId);assert.ok(raw);assert.ok(s.start>=0&&s.end>s.start&&s.end<=raw.duration+.02);assert.ok(['cut','fade','slide'].includes(s.transition));assert.equal(typeof s.title,'string');duration+=(s.end-s.start)/s.speed}
  assert.ok(Math.abs(duration-t.duration)<.01);
 }
});
test('actual human interview retains original speech and explicit factual source',()=>{
 const t=TEMPLATES.find(t=>t.id==='interview');assert.equal(t.originalAudio,true);assert.ok(!t.audioFile);assert.match(t.description,/настоящего интервью/);assert.match(t.audioDescription,/Оригинальный английский/);
 const sources=JSON.parse(fs.readFileSync(local('assets/produced/sources.json')));assert.ok(sources.sources.some(s=>s.id==='nasa-interview'&&s.page==='https://svs.gsfc.nasa.gov/13868/'));
});
test('examples use all six edited videos and purpose-made card covers',()=>{
 const html=fs.readFileSync(local('examples.html'),'utf8');
 for(const t of TEMPLATES){assert.ok(html.includes(t.preview));assert.ok(html.includes(t.poster))}
 assert.ok(!html.includes('assets/footage/auto.mp4'));
});
