import http from 'node:http';
import worker from '../dist/server/index.js';
import {database} from '../tests/d1.mjs';
const env={DB:database('../../work/admin-preview.sqlite'),ADMIN_EMAIL:'owner@example.test'};
http.createServer(async(req,res)=>{try{const chunks=[];for await(const c of req)chunks.push(c);const headers=new Headers(req.headers);headers.set('oai-authenticated-user-email','owner@example.test');const response=await worker.fetch(new Request('http://127.0.0.1:4180'+req.url,{method:req.method,headers,...(!['GET','HEAD'].includes(req.method)?{body:Buffer.concat(chunks)}:{})}),env);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()))}catch(e){res.writeHead(500);res.end(e.message)}}).listen(4180,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4180/admin/ (loopback-only fixture identity)'));
