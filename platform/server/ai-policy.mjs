export function aiRequestPolicy(b={}){return {firstMs:65000,retryMs:65000,totalMs:90000,maxTokens:b.production?4200:b.messages?.at(-1)?.content?.includes('coverIdeas')?2600:3000};}
export function transientAIError(e){return ['TimeoutError','AbortError','TypeError'].includes(e?.name)||[404,408,429,500,502,503,504].includes(e?.upstreamStatus);}
