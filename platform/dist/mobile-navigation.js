// A native modal gives small-screen navigation real focus management and Escape support.
export function mobileNavigation(trigger,nav,{title='Навигация',extra=[]}={}){
 if(!trigger||!nav)return;
 const dialog=document.createElement('dialog');dialog.className='mobile-navigation';dialog.id='mobile-navigation-'+crypto.randomUUID();dialog.setAttribute('aria-label',title);
 const head=document.createElement('div');head.className='mobile-navigation-heading';const heading=document.createElement('h2');heading.textContent=title;
 const close=document.createElement('button');close.type='button';close.className='mobile-navigation-close';close.textContent='×';close.setAttribute('aria-label','Закрыть меню');close.addEventListener('click',()=>dialog.close());head.append(heading,close);
 const links=nav.cloneNode(true);links.removeAttribute('id');links.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));links.querySelectorAll('a.active').forEach(a=>a.setAttribute('aria-current','page'));
 dialog.append(head,links);if(extra.length){const footer=document.createElement('div');footer.className='mobile-navigation-extra';extra.filter(Boolean).forEach(n=>footer.append(n.cloneNode(true)));dialog.append(footer)}document.body.append(dialog);
 trigger.setAttribute('aria-haspopup','dialog');trigger.setAttribute('aria-controls',dialog.id);trigger.setAttribute('aria-expanded','false');
 trigger.addEventListener('click',()=>{dialog.showModal();trigger.setAttribute('aria-expanded','true');document.documentElement.classList.add('navigation-open')});
 dialog.addEventListener('close',()=>{trigger.setAttribute('aria-expanded','false');document.documentElement.classList.remove('navigation-open')});
 dialog.addEventListener('click',event=>{if(event.target.closest('a'))dialog.close();if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});
 const wide=matchMedia('(min-width:1024px)');wide.addEventListener('change',()=>{if(wide.matches&&dialog.open)dialog.close()});
 return dialog;
}
