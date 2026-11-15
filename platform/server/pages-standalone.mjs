import worker from './worker.mjs';
export default {fetch(req,env){return worker.fetch(req,{...env,PAGES_STANDALONE:'1'})}};
