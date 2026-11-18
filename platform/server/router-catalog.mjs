export const ROUTER_MODELS=[
 {id:'mirai-opus',model_id:'claude-opus-5.5',name:'Claude Opus 5.5 В· Mirai',provider:'mirai',min_plan:'pro',cost:35,enabled:1},
 {id:'router-auto',model_id:'openrouter/free',name:'OpenRouter Auto В· СЃРІРѕР±РѕРґРЅС‹Рµ РјРѕРґРµР»Рё',min_plan:'lite',cost:5,enabled:1},
 {id:'router-gemma',model_id:'google/gemma-4-31b-it:free',name:'Gemma 4 В· РјРѕРЅС‚Р°Р¶РЅС‹Р№ РїР»Р°РЅ',min_plan:'plus',cost:8,enabled:1},
 {id:'router-gpt-mini',model_id:'openai/gpt-4.1-mini',name:'GPT-4.1 mini',min_plan:'plus',cost:12,enabled:1},
 {id:'router-gemini',model_id:'google/gemini-2.5-flash',name:'Gemini 2.5 Flash',min_plan:'plus',cost:12,enabled:1},
 {id:'router-gpt',model_id:'openai/gpt-4.1',name:'GPT-4.1',min_plan:'pro',cost:25,enabled:1},
 {id:'router-claude',model_id:'anthropic/claude-sonnet-4.5',name:'Claude Sonnet 4.5',min_plan:'pro',cost:35,enabled:1}
];
export function runtimeRouter(env,id){const m=ROUTER_MODELS.find(m=>m.id===id);const secret=m?.provider==='mirai'?env.MIRAI_API_KEY:env.OPENROUTER_API_KEY;return secret&&m?{...m,provider:m.provider||'openrouter',runtime_secret:secret}:null}
