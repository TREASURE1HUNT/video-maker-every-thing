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
 const t=TEMPLATES.find(t=>t.id==='interview');assert.equal(t.originalAudio,true);assert.ok(!t.audioFile);assert.match(t.description,/настоящ(?:его|ее) интервью/i);assert.match(t.audioDescription,/Оригинальный английский/);
 const sources=JSON.parse(fs.readFileSync(local('assets/produced/sources.json')));assert.ok(sources.sources.some(s=>s.id==='nasa-interview'&&s.page==='https://svs.gsfc.nasa.gov/13868/'));
});
test('examples use all six edited videos and purpose-made card covers',()=>{
 const html=fs.readFileSync(local('examples.html'),'utf8');
 for(const t of TEMPLATES){assert.ok(html.includes(t.preview));assert.ok(html.includes(t.poster))}
 assert.ok(!html.includes('assets/footage/auto.mp4'));
});
test('all six templates include readable timed editable subtitles and landscape previews',()=>{
 for(const t of TEMPLATES){
  assert.equal(t.width,1280);assert.equal(t.height,720);assert.equal(t.aspect,'16:9');assert.ok(t.cues.length>=6);
  assert.ok(t.captionStyle.fontSize>=44);
  assert.ok(t.captionStyle.safeBottom>=180);assert.equal(t.captionStyle.nativeControlsReserve,true);
  for(const c of t.cues){assert.ok(c.start>=0&&c.end>c.start&&c.end<=t.duration+.01);assert.ok(c.text.trim())}
  for(const track of Object.values(t.captionTracks)){assert.ok(fs.statSync(local(track.srt)).size>100);assert.ok(fs.readFileSync(local(track.vtt),'utf8').startsWith('WEBVTT'))}
  if(t.id!=='interview'){assert.match(t.preview,/-neural-v2\.mp4$/);assert.match(t.audioDescription,/FishAudio/);assert.ok(!t.audioDescription.includes('Irina'))}
 }
});

