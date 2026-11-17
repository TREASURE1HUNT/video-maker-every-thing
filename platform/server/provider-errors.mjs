// OpenRouter can return generation-time errors inside an HTTP 200 body.
// Preserve only bounded typed metadata, never raw provider text or credentials.
export function providerPayloadError(data){if(!data?.error)return null;const code=Number(data.error.code),status=[400,401,402,403,404,408,429,500,502,503,504].includes(code)?code:502;return Object.assign(new Error('Provider generation error'),{upstreamStatus:status,diagnostic:'generation_error'});}
