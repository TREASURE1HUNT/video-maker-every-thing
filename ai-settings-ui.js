import {customer,membership,modelOptions} from './membership.js';
const el=(t,c,text)=>{const n=document.createElement(t);if(c)n.className=c;if(text!==undefined)n.textContent=text;return n};
export let aiPreferences={model_id:'local',skill_id:'',language:'ru',style:'cinematic',duration:30,aspect:'9:16',captions:false,voice:'Без озвучки',instructions:''};
export async function loadAISettings(){try{const r=await customer('/api/ai/settings');aiPreferences={...aiPreferences,...r.preferences};return r}catch(e){return {preferences:aiPreferences,skills:[],error:e.message}}}
export async function aiSettingsScreen(root,{onSave,compact=false}={}){
 root.replaceChildren(el('p','account-status','Загружаем настройки ИИ…'));const result=await loadAISettings();root.replaceChildren();
 if(!membership().authenticated){root.append(el('h1','','Настройки ИИ'),el('p','','Войдите, чтобы сохранить модель и настройки монтажа.'));const a=el('a','ws-primary','Войти');a.href='login.html';root.append(a);return}
 const form=el('form','ai-settings-form'),status=el('p','account-status');status.role='status';const fields={};
 if(!compact){root.append(el('h1','','Настройки ИИ'),el('p','ai-settings-lead','Модель, монтаж и скиллы для следующих проектов. Настройки сохраняются в вашем аккаунте.'))}
 const grid=el('div','ai-settings-grid');
 const add=(key,title,type='text',options)=>{const label=el('label','ai-setting-field',title);let input;if(options){input=el('select');for(const [v,t]of options){const o=el('option','',t);o.value=v;input.append(o)}}else input=el(type==='textarea'?'textarea':'input');if(type!=='textarea'&&!options)input.type=type;input.name=key;input.value=aiPreferences[key]??'';label.append(input);fields[key]=input;grid.append(label);return input};
 const model=add('model_id','Модель ИИ','text',[]);modelOptions(model,aiPreferences.model_id);model.setAttribute('aria-describedby','ai-model-help');
 const skill=add('skill_id','Скилл видеопроизводства','text',[['','Стандартный монтаж'],...(result.skills||[]).map(s=>[s.id,s.name+(s.available?'':' — нужен '+s.min_plan)])]);for(const o of skill.options)if(o.value)o.disabled=!result.skills.find(s=>s.id===o.value)?.available;skill.value=aiPreferences.skill_id;
 add('style','Стиль монтажа','text',[['cinematic','Кинематографично'],['dynamic','Динамично'],['minimal','Минимализм'],['product','Реклама продукта']]);
 add('aspect','Формат видео','text',[['9:16','9:16 — вертикальный'],['16:9','16:9 — горизонтальный'],['1:1','1:1 — квадрат']]);
 const d=add('duration','Длительность, секунды','number');d.min='5';d.max='180';d.required=true;
 add('language','Язык текста','text',[['ru','Русский'],['en','English']]);
 add('voice','Пожелания к озвучке');fields.voice.maxLength=100;
 const captions=add('captions','Показывать субтитры','text',[['0','Нет'],['1','Да, из предоставленной расшифровки']]);captions.value=aiPreferences.captions?'1':'0';
 const notes=add('instructions','Дополнительные указания','textarea');notes.rows=4;notes.maxLength=3000;notes.closest('label').classList.add('ai-setting-wide');
 const help=el('p','account-note','Ключи провайдеров подключает администратор. Локальный планировщик работает по правилам, без нейросети. Скиллы применяются к запросам подключённой модели. Для анализа содержимого нужны соответствующий провайдер и передача материалов; сейчас ИИ получает текст и метаданные.');help.id='ai-model-help';
 const submit=el('button','ws-primary','Сохранить настройки');submit.type='submit';form.append(grid,help,submit,status);root.append(form);
 if(['owner','admin'].includes(membership().user?.role)){const a=el('a','settings-admin-link','Подключить модели и скиллы в админке');a.href='/admin/#ai';root.append(a)}
 if(result.error){status.textContent=result.error;return}
 form.onsubmit=async e=>{e.preventDefault();submit.disabled=true;status.textContent='Сохраняем…';try{const data=Object.fromEntries(Object.entries(fields).map(([k,n])=>[k,n.value]));data.duration=Number(data.duration);data.captions=data.captions==='1';const r=await customer('/api/ai/settings',data);aiPreferences=r.preferences;status.textContent='Настройки сохранены';onSave?.(aiPreferences)}catch(err){status.textContent=err.message}finally{submit.disabled=false}};
}
