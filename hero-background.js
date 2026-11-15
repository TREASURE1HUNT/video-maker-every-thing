(()=>{const video=document.querySelector('#hero-background'),button=document.querySelector('#hero-background-toggle');if(!video||!button)return;const reduce=matchMedia('(prefers-reduced-motion: reduce)');let userPaused=false,explicit=false,inView=true,failed=false;video.muted=true;video.defaultMuted=true;
function sync(){const paused=video.paused;button.querySelector('span').textContent=failed?'Видео недоступно':paused?'Воспроизвести':'Пауза';button.setAttribute('aria-label',paused?'Воспроизвести фоновое видео':'Приостановить фоновое видео');button.querySelector('path').setAttribute('d',paused?'m8 5 11 7-11 7Z':'M8 5v14M16 5v14');button.disabled=failed}
function update(){if(failed||document.hidden||!inView||userPaused||(reduce.matches&&!explicit)){video.pause();sync();return}video.play().then(sync).catch(sync)}
button.addEventListener('click',()=>{if(video.paused){userPaused=false;explicit=true;update()}else{userPaused=true;video.pause();sync()}});
video.addEventListener('play',sync);video.addEventListener('pause',sync);
function failure(){failed=true;video.pause();sync()}video.addEventListener('error',failure);video.querySelector('source')?.addEventListener('error',failure);
new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;update()},{threshold:.1}).observe(video);
document.addEventListener('visibilitychange',update);addEventListener('pagehide',()=>video.pause());
reduce.addEventListener('change',()=>{explicit=false;update()});if(reduce.matches){video.autoplay=false;video.removeAttribute('autoplay')}update();
})();
