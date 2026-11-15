export const ROUTER_MODELS=[
 {id:'router-auto',model_id:'openrouter/free',name:'OpenRouter Auto · свободные модели',min_plan:'lite',cost:1,enabled:1},
 {id:'router-gemma',model_id:'google/gemma-4-31b-it:free',name:'Gemma 4 · монтажный план',min_plan:'plus',cost:2,enabled:1},
 {id:'router-gpt-mini',model_id:'openai/gpt-4.1-mini',name:'GPT-4.1 mini',min_plan:'plus',cost:3,enabled:0},
 {id:'router-gemini',model_id:'google/gemini-2.5-flash',name:'Gemini 2.5 Flash',min_plan:'plus',cost:3,enabled:0},
 {id:'router-gpt',model_id:'openai/gpt-4.1',name:'GPT-4.1',min_plan:'pro',cost:8,enabled:0},
 {id:'router-claude',model_id:'anthropic/claude-sonnet-4.5',name:'Claude Sonnet 4.5',min_plan:'pro',cost:12,enabled:0}
];
export function runtimeRouter(env,id){const m=ROUTER_MODELS.find(m=>m.id===id);return env.OPENROUTER_API_KEY&&m?{...m,provider:'openrouter',runtime_secret:env.OPENROUTER_API_KEY}:null}
