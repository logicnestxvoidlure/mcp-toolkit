#!/usr/bin/env node
import { createInterface } from 'node:readline';
import { definitions, execute } from './tools.js';

const VERSION='2025-03-26';
function respond(message) { process.stdout.write(JSON.stringify(message)+'\n'); }
function handle(request) {
  if(!request || request.jsonrpc!=='2.0' || typeof request.method!=='string') throw Object.assign(new Error('Invalid Request'),{code:-32600});
  const {id,method,params={}}=request;
  if(method==='notifications/initialized') return;
  if(id===undefined) return;
  if(method==='initialize') return {jsonrpc:'2.0',id,result:{protocolVersion:VERSION,capabilities:{tools:{listChanged:false}},serverInfo:{name:'mcp-toolkit',version:'0.2.0'}}};
  if(method==='ping') return {jsonrpc:'2.0',id,result:{}};
  if(method==='tools/list') return {jsonrpc:'2.0',id,result:{tools:definitions}};
  if(method==='tools/call') {
    try {
      const result=execute(params.name,params.arguments);
      return {jsonrpc:'2.0',id,result:{content:[{type:'text',text:JSON.stringify(result,null,2)}]}};
    } catch(e) {
      return {jsonrpc:'2.0',id,result:{content:[{type:'text',text:e.message}],isError:true}};
    }
  }
  return {jsonrpc:'2.0',id,error:{code:-32601,message:'Method not found'}};
}

// Troubleshooting Section for MCP Inspector Setup
function troubleshooting() {
  return {
    jsonrpc: '2.0',
    id: null,
    result: {
      content: [
        { type: 'text', text: 'Troubleshooting MCP Inspector Setup:' },
        { type: 'text', text: '1. Ensure that the MCP Inspector is properly installed and configured.' },
        { type: 'text', text: '2. Check the network connection and ensure that the server is reachable.' },
        { type: 'text', text: '3. Verify that the correct version of the MCP Toolkit is being used.' },
        { type: 'text', text: '4. Review the logs for any error messages that may indicate the source of the problem.' },
        { type: 'text', text: '5. If issues persist, consult the documentation or contact support.' }
      ]
    }
  };
}

const input=createInterface({input:process.stdin,crlfDelay:Infinity});
input.on('line',line=>{
  let request;
  try {request=JSON.parse(line);} catch {respond({jsonrpc:'2.0',id:null,error:{code:-32700,message:'Parse error'}});return;}
  try {
    if (request.method === 'tools/troubleshooting') {
      const response = troubleshooting();
      respond(response);
    } else {
      const response = handle(request);
      if(response) respond(response);
    }
  } catch(e) {
    respond({jsonrpc:'2.0',id:request?.id??null,error:{code:e.code??-32603,message:e.message}});
  }
});