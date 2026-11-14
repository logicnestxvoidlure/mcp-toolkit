import test from 'node:test';
import assert from 'node:assert/strict';
import { definitions, execute } from '../src/tools.js';

test('three tools are published', () => assert.equal(definitions.length, 3));
test('JSON object inspection', () => assert.deepEqual(execute('json_inspect',{json:'{"hello":1}'}),{valid:true,type:'object',keys:['hello'],keyCount:1}));
test('JSON arrays', () => assert.deepEqual(execute('json_inspect',{json:'[1,2]'}),{valid:true,type:'array',length:2}));
test('bad JSON fails', () => assert.throws(()=>execute('json_inspect',{json:'{bad'})));
test('text counts', () => assert.deepEqual(execute('text_analyze',{text:'hello world\\nagain'}),{characters:17,words:3,lines:2}));
test('empty text', () => assert.deepEqual(execute('text_analyze',{text:''}),{characters:0,words:0,lines:0}));
test('URL inspection', () => assert.deepEqual(execute('url_inspect',{url:'https://example.com/a?x=1#top'}),{protocol:'https:',hostname:'example.com',port:'',path:'/a',query:{x:'1'},hash:'#top'}));
test('non-HTTP URL rejected', () => assert.throws(()=>execute('url_inspect',{url:'file:///etc/passwd'})));
test('unknown tool rejected', () => assert.throws(()=>execute('missing',{})));
