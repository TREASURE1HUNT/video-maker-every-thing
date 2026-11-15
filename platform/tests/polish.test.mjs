import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
test('shared visual refinement reaches every rendered public/app HTML route',()=>{
 for(const n of fs.readdirSync('dist').filter(n=>n.endsWith('.html'))){
  const s=fs.readFileSync('dist/'+n,'utf8');if(!s.includes('<head>')||s.includes('http-equiv="refresh"'))continue;
  assert.match(s,/href="polish\.css\?v=2"/,n);assert.ok(s.indexOf('href="polish.css')>s.indexOf('href="taste.css'),n);
 }
});
test('monochrome refinement retains reduced-motion, visible focus and small-screen form layouts',()=>{
 const css=fs.readFileSync('dist/polish.css','utf8');
 assert.match(css,/prefers-reduced-motion:reduce/);assert.match(css,/:focus-visible/);assert.match(css,/@media\(max-width:639px\)/);
 assert.match(css,/\.profile-grid[^{]*\{[^}]*grid-template-columns: minmax\(0,1fr\)/);
 const admin=fs.readFileSync('admin/src/main.tsx','utf8');
 assert.ok(admin.includes("import '../../dist/polish.css'"));assert.ok(admin.includes("import './polish-admin.css'"));
});
test('home uses authored background video, no pause button and functional destinations',()=>{
 const s=fs.readFileSync('dist/index.html','utf8');
 assert.match(s,/<video id="hero-background"[^>]*autoplay muted loop playsinline/);assert.match(s,/assets\/hero\/vmet-promo-59b5fb2afb59.mp4/);
 assert.ok(!s.includes('id="hero-background-toggle"'));assert.match(s,/href="workspace.html"/);assert.match(s,/href="editor.html\?demo=1"/);
 assert.ok(!s.includes('id="scene"'));
});
test('profile UI sends only editable fields, not readonly email rejected by server',()=>{
 const s=fs.readFileSync('dist/account-ui.js','utf8');
 assert.ok(s.includes("name:data.get('name'),timezone:data.get('timezone'),default_model:data.get('default_model')"));
 assert.ok(!s.includes("customer('/api/account/profile',Object.fromEntries(new FormData(form)))"));
});
test('template catalog uses real footage and local files, not abstract geometry previews',async()=>{
 const {TEMPLATES}=await import('../dist/project-store.js');
 assert.equal(TEMPLATES.length,6);
 for(const t of TEMPLATES){assert.ok(['remotion-edited-licensed-footage','nasa-factual-interview-excerpt'].includes(t.source));assert.match(t.preview,/^assets\/produced\/.*\.mp4$/);assert.ok(fs.statSync('dist/'+t.preview).size>100000);assert.ok(fs.existsSync('dist/'+t.poster));assert.ok(t.duration>12&&t.duration<30);assert.ok(t.editableSegments.length>=3)}
});
test('workspace owns one grid offset and model field belongs to the composer',()=>{
 const css=fs.readFileSync('dist/polish.css','utf8');assert.match(css,/\.ws-shell\{display:grid/);assert.match(css,/\.ws-main\{margin:0;width:100%/);
 const js=fs.readFileSync('dist/workspace.js','utf8');assert.ok(js.includes('composer.insertBefore(modelRow,bottom)'));assert.ok(!js.includes('hero.append(composer,modelRow)'));
});
test('unavailable email and OAuth methods do not promise a code or expose dead Yandex action',()=>{
 const js=fs.readFileSync('dist/auth-ui.js','utf8');assert.ok(js.includes('email.disabled=false'));assert.ok(js.includes('request.disabled=!o.email'));assert.ok(js.includes('yandex.disabled=!o.yandex'));assert.ok(!js.includes('Пока используй код на адрес Яндекс Почты'));
});
test('public header stays in document flow and obsolete decorative strip is gone',()=>{
 const css=fs.readFileSync('dist/polish.css','utf8');assert.match(css,/\.site-header,\.site-header.nav\{position:relative/);
 const html=fs.readFileSync('dist/index.html','utf8');assert.ok(!html.includes('hero-index'));assert.ok(!html.includes('taste-scene-strip'));
 const examples=fs.readFileSync('dist/examples.html','utf8');assert.ok(!examples.includes('demo-motion'));assert.ok(examples.includes('assets/produced/product-neural-v2.mp4'));
});

