import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';

test('MCP handshake, discovery, invocation, and errors over stdio',async()=>{
 const child=spawn(process.execPath,['src/server.js'],{stdio:['pipe','pipe','pipe']});
 let data=''; const responses=[];
 child.stdout.on('data',chunk=>{data+=chunk;let index;while((index=data.indexOf('\n'))>=0){const line=data.slice(0,index);data=data.slice(index+1);responses.push(JSON.parse(line));}});
 const send=message=>child.stdin.write(JSON.stringify(message)+'\n');
 send({jsonrpc:'2.0',id:1,method:'initialize',params:{protocolVersion:'2025-03-26',capabilities:{},clientInfo:{name:'test',version:'1'}}});
 send({jsonrpc:'2.0',method:'notifications/initialized'});
 send({jsonrpc:'2.0',id:2,method:'tools/list'});
 send({jsonrpc:'2.0',id:3,method:'tools/call',params:{name:'text_analyze',arguments:{text:'hello world'}}});
 send({jsonrpc:'2.0',id:4,method:'does/not/exist'});
 child.stdin.end(); await once(child,'close');
 assert.equal(responses.length,4);
 assert.equal(responses[0].result.serverInfo.name,'mcp-toolkit');
 assert.equal(responses[1].result.tools.length,7);
 assert.equal(JSON.parse(responses[2].result.content[0].text).words,2);
 assert.equal(responses[3].error.code,-32601);
});
