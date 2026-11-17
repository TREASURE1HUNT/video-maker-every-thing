import {TRANSITIONS} from './transition-catalog.js';
import {loadVoices,createSpeech} from './speech-ui.js';
import {customer,membership,modelOptions} from './membership.js';
const el=(t,c,text)=>{const n=document.createElement(t);if(c)n.className=c;if(text!==undefined)n.textContent=text;return n};
export let aiPreferences={auto_director:true,model_id:'local',skill_id:'',language:'ru',style:'cinematic',duration:30,aspect:'9:16',captions:false,voice:'Спокойная подача',voice_mode:'none',voice_engine:'router-fish',voice_id:'default',voice_speed:1,voice_text:'',transition:'wipe',music_mode:'original',caption_style:'clean',cover_title:'',instructions:''};
export async function loadAISettings(){try{const r=await customer('/api/ai/settings');aiPreferences={...aiPreferences,...r.preferences};return r}catch(e){return {preferences:aiPreferences,skills:[],error:e.message}}}
export async function aiSettingsScreen(root,{onSave,compact=false}={}){
 root.replaceChildren(el('p','account-status','Загружаем настройки ИИ…'));const result=await loadAISettings();root.replaceChildren();
 if(!membership().authenticated){root.append(el('h1','','Настройки ИИ'),el('p','','Войдите, чтобы сохранить модель и настройки монтажа.'));const a=el('a','ws-primary','Войти');a.href='login.html';root.append(a);return}
 const form=el('form','ai-settings-form'),status=el('p','account-status');status.role='status';const fields={};
 if(!compact){root.append(el('h1','','Настройки ИИ'),el('p','ai-settings-lead','Модель, монтаж и скиллы для следующих проектов. Настройки сохраняются в вашем аккаунте.'))}
 const grid=el('div','ai-settings-grid');
 const add=(key,title,type='text',options)=>{const label=el('label','ai-setting-field',title);let input;if(options){input=el('select');for(const [v,t]of options){const o=el('option','',t);o.value=v;input.append(o)}}else input=el(type==='textarea'?'textarea':'input');if(type!=='textarea'&&!options)input.type=type;input.name=key;input.value=key==='auto_director'?(aiPreferences[key]===false?'0':'1'):aiPreferences[key]??'';label.append(input);fields[key]=input;grid.append(label);return input};
 const model=add('model_id','Модель ИИ','text',[]);modelOptions(model,aiPreferences.model_id);model.setAttribute('aria-describedby','ai-model-help');
 const skill=add('skill_id','Скилл видеопроизводства','text',[['','Стандартный монтаж'],...(result.skills||[]).map(s=>[s.id,s.name+(s.available?'':' — нужен '+s.min_plan)])]);for(const o of skill.options)if(o.value)o.disabled=!result.skills.find(s=>s.id===o.value)?.available;skill.value=aiPreferences.skill_id;
 add('auto_director','Подбор оформления','text',[['1','Авто · ИИ выбирает под видео'],['0','Мои настройки']]);
 add('style','Стиль монтажа','text',[['cinematic','Кинематографично'],['dynamic','Динамично'],['minimal','Минимализм'],['product','Реклама продукта']]);
 add('aspect','Формат видео','text',[['9:16','9:16 — вертикальный'],['16:9','16:9 — горизонтальный'],['1:1','1:1 — квадрат']]);
 const d=add('duration','Длительность, секунды','number');d.min='5';d.max='180';d.required=true;
 add('language','Язык текста','text',[['ru','Русский'],['en','English']]);
 const voiceMode=add('voice_mode','Озвучка','text',[['none','Без озвучки'],['original','Оставить речь из исходного видео'],['upload','Своя запись — загрузить в редакторе'],['ai','Нейросетевая озвучка']]);
 const voices=await loadVoices().catch(()=>({connections:[]}));const engine=add('voice_engine','Движок озвучки','text',voices.connections.map(c=>[c.id,c.name+(c.available?'':' — '+c.reason)]));for(const o of engine.options)o.disabled=!voices.connections.find(c=>c.id===o.value)?.available;engine.value=voices.connections.find(c=>c.id===aiPreferences.voice_engine&&c.available)?.id||voices.connections.find(c=>c.available)?.id||'';
 const voiceId=add('voice_id','Голос синтеза','text',[['alloy','Alloy · ровный'],['echo','Echo · мягкий'],['fable','Fable · выразительный'],['onyx','Onyx · низкий'],['nova','Nova · энергичный'],['shimmer','Shimmer · лёгкий']]);
 const speed=add('voice_speed','Темп речи','number');speed.min='.75';speed.max='1.5';speed.step='.05';
 const script=add('voice_text','Текст озвучки','textarea');script.rows=3;script.maxLength=2000;script.closest('label').classList.add('ai-setting-wide');script.placeholder='Точный текст, который должен произнести голос';
 const syncVoice=()=>{const c=voices.connections.find(c=>c.id===engine.value);voiceId.replaceChildren();for(const id of c?.voices||['default']){const o=el('option','',id==='default'?'Естественный голос':id);o.value=id;voiceId.append(o)}voiceId.value=c?.voices?.includes(aiPreferences.voice_id)?aiPreferences.voice_id:c?.voices?.[0]||'default';voiceSync()};const voiceSync=()=>{const ai=voiceMode.value==='ai';engine.disabled=!ai;voiceId.disabled=!ai;speed.disabled=!ai||!['f5',...voices.connections.filter(c=>c.engine==='openai').map(c=>c.id)].includes(engine.value);if(speed.disabled)speed.value=1;script.disabled=!ai};voiceMode.onchange=voiceSync;engine.onchange=syncVoice;syncVoice();
 add('voice','Пожелания к сценарию озвучки');fields.voice.maxLength=100;fields.voice.placeholder='Например: спокойно, без рекламного нажима';
 add('music_mode','Звуковое оформление','text',[['original','Оригинальный звук'],['upload','Своя музыка / аудиофайл'],['none','Без звука']]);
 add('transition','Переход по умолчанию','text',Object.entries(TRANSITIONS));
 add('caption_style','Стиль субтитров','text',[['clean','Сдержанный'],['bold','Крупный контрастный'],['outline','Контурный']]);
 const cover=add('cover_title','Заголовок обложки');cover.maxLength=100;
 
 const captions=add('captions','Показывать субтитры','text',[['0','Нет'],['1','Да, из предоставленной расшифровки']]);captions.value=aiPreferences.captions?'1':'0';
 const notes=add('instructions','Дополнительные указания','textarea');notes.rows=4;notes.maxLength=3000;notes.closest('label').classList.add('ai-setting-wide');
 const help=el('p','account-note','Голос ИИ — синтезированная речь. Настройки передаются в монтажный запрос; аудио создаётся отдельно кнопкой «Озвучить текст» в редакторе. Fish Audio доступен при серверном подключении OpenRouter. Самостоятельные движки появляются после подключения их сервера администратором. Локальный планировщик работает по правилам, без нейросети. Скиллы применяются к запросам подключённой модели. Для анализа содержимого нужны соответствующий провайдер и передача материалов; сейчас ИИ получает текст и метаданные.');help.id='ai-model-help';
 const speechBox=el('div','speech-action'),preview=el('button','ws-outline','Прослушать текст · 5 кредитов'),speechStatus=el('p','account-note');preview.type='button';speechBox.append(preview,speechStatus);preview.onclick=async()=>{preview.disabled=true;speechStatus.textContent='Создаём аудио…';try{const blob=await createSpeech({text:fields.voice_text.value,voice:fields.voice_id.value,speed:fields.voice_speed.value,connection_id:fields.voice_engine.value});const audio=el('audio');audio.controls=true;const url=URL.createObjectURL(blob);audio.src=url;audio.onloadeddata=()=>audio.play().catch(()=>{});speechBox.querySelector('audio')?.remove();speechBox.append(audio);speechStatus.textContent='Синтезированная речь. В редакторе можно добавить её к проекту.'}catch(e){speechStatus.textContent=e.message}finally{preview.disabled=false}};
 const submit=el('button','ws-primary','Сохранить настройки');submit.type='submit';form.append(grid,help,speechBox,submit,status);root.append(form);
 if(['owner','admin'].includes(membership().user?.role)){const a=el('a','settings-admin-link','Подключить модели и скиллы в админке');a.href='/admin/#ai';root.append(a)}
 if(result.error){status.textContent=result.error;return}
 form.onsubmit=async e=>{e.preventDefault();submit.disabled=true;status.textContent='Сохраняем…';try{const data=Object.fromEntries(Object.entries(fields).map(([k,n])=>[k,n.value]));data.auto_director=data.auto_director==='1';data.duration=Number(data.duration);data.captions=data.captions==='1';const r=await customer('/api/ai/settings',data);aiPreferences=r.preferences;status.textContent='Настройки сохранены';onSave?.(aiPreferences)}catch(err){status.textContent=err.message}finally{submit.disabled=false}};
}


