import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
test('shared visual refinement reaches every rendered public/app HTML route',()=>{
 for(const n of fs.readdirSync('dist').filter(n=>n.endsWith('.html'))){
  const s=fs.readFileSync('dist/'+n,'utf8');if(!s.includes('<head>')||s.includes('http-equiv="refresh"'))continue;
  assert.match(s,/href="polish\.css\?v=1"/,n);assert.ok(s.indexOf('href="polish.css')>s.indexOf('href="taste.css'),n);
 }
});
test('monochrome refinement retains reduced-motion, visible focus and small-screen form layouts',()=>{
 const css=fs.readFileSync('dist/polish.css','utf8');
 assert.match(css,/prefers-reduced-motion:reduce/);assert.match(css,/:focus-visible/);assert.match(css,/@media\(max-width:639px\)/);
 assert.match(css,/\.profile-grid[^{]*\{[^}]*grid-template-columns: minmax\(0,1fr\)/);
 const admin=fs.readFileSync('admin/src/main.tsx','utf8');
 assert.ok(admin.includes("import '../../dist/polish.css'"));assert.ok(admin.includes("import './polish-admin.css'"));
});
test('home keeps real video controls, truthful demo timing and functional studio destinations',()=>{
 const s=fs.readFileSync('dist/index.html','utf8');
 assert.match(s,/<video id="intro-video" controls playsinline/);assert.match(s,/assets\/hero\/intro.mp4/);
 assert.match(s,/<figcaption class="film-caption">/);assert.match(s,/href="workspace.html"/);assert.match(s,/href="editor.html\?demo=1"/);
 assert.ok(!s.includes('id="scene"'));
});
test('profile UI sends only editable fields, not readonly email rejected by server',()=>{
 const s=fs.readFileSync('dist/account-ui.js','utf8');
 assert.ok(s.includes("name:data.get('name'),timezone:data.get('timezone'),default_model:data.get('default_model')"));
 assert.ok(!s.includes("customer('/api/account/profile',Object.fromEntries(new FormData(form)))"));
});
