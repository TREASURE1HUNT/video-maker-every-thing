import {pipeline,env} from './assets/asr/transformers-3.8.1.js';

env.allowLocalModels=false;env.useBrowserCache=true;

env.backends.onnx.wasm.wasmPaths=new URL('./assets/asr/',self.location.href).href;

env.backends.onnx.wasm.numThreads=1;env.backends.onnx.wasm.proxy=false;

const MODELS={base:{id:'onnx-community/whisper-base_timestamped',revision:'608c49e61301901684bc36cac8f74b95ff6b5a8e'},small:{id:'onnx-community/whisper-small_timestamped',revision:'65caa70f294b46e1c33ff820aae6b16d048ab818'}};

let recognizer=null,selected=null;

self.onmessage=async({data})=>{const {id,audio,model,language}=data;if(!MODELS[model]||!(audio instanceof Float32Array)||audio.length>480000){self.postMessage({id,error:'Неверные параметры локального распознавания'});return}try{if(!recognizer||selected!==model){if(recognizer)await recognizer.dispose();recognizer=null;selected=model;self.postMessage({id,status:'loading',message:'Загружаем Whisper на устройство…'});recognizer=await pipeline('automatic-speech-recognition',MODELS[model].id,{revision:MODELS[model].revision,device:'wasm',dtype:'q8',progress_callback:p=>self.postMessage({id,status:'download',file:p.file,loaded:p.loaded,total:p.total,progress:p.progress})})}self.postMessage({id,status:'recognizing',message:'Whisper распознаёт речь на устройстве…'});let result=await recognizer(audio,{language:language==='auto'?undefined:language==='en'?'english':'russian',task:'transcribe',return_timestamps:'word'});const duration=audio.length/16000;if(result.text?.trim()&&(!result.chunks?.length||result.chunks.some(c=>Number(c.timestamp?.[0])>duration||Number(c.timestamp?.[1])>duration+.15))){result=await recognizer(audio,{language:language==='auto'?undefined:language==='en'?'english':'russian',task:'transcribe',return_timestamps:true});result.segmentTiming=true}self.postMessage({id,result})}catch(e){self.postMessage({id,error:e.message||'Локальное распознавание не завершено'})}};

