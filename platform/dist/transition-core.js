const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function transitionDuration(clip,previous){if(!previous||clip.transition==='cut')return 0;if(clip.assetId===previous.assetId&&Math.abs(clip.start-previous.end)<.08&&clip.speed===previous.speed)return 0;const length=c=>(c.end-c.start)/(c.speed||1);return Math.min(clamp(Number(clip.transitionDuration)||.28,.1,.65),length(clip)*.25,length(previous)*.25)}
export function transitionMix(offset,duration){if(!duration)return 1;const t=clamp(offset/duration,0,1);return t*t*(3-2*t)}
