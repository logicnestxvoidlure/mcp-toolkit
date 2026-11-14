import test from 'node:test';
import assert from 'node:assert/strict';
import { definitions, execute } from '../src/tools.js';

test('nine tools are published', () => assert.equal(definitions.length, 9));
test('JSON object inspection', () => assert.deepEqual(execute('json_inspect',{json:'{"hello":1}'}),{valid:true,type:'object',keys:['hello'],keyCount:1}));
test('JSON arrays', () => assert.deepEqual(execute('json_inspect',{json:'[1,2]'}),{valid:true,type:'array',length:2}));
test('bad JSON fails', () => assert.throws(()=>execute('json_inspect',{json:'{bad'})));
test('text counts', () => assert.deepEqual(execute('text_analyze',{text:'hello world\nagain'}),{characters:17,words:3,lines:2}));
test('empty text', () => assert.deepEqual(execute('text_analyze',{text:''}),{characters:0,words:0,lines:0}));
test('URL inspection', () => assert.deepEqual(execute('url_inspect',{url:'https://example.com/a?x=1#top'}),{protocol:'https:',hostname:'example.com',port:'',path:'/a',query:{x:'1'},hash:'#top'}));
test('non-HTTP URL rejected', () => assert.throws(()=>execute('url_inspect',{url:'file:///etc/passwd'})));
test('unknown tool rejected', () => assert.throws(()=>execute('missing',{})));

test('SHA-256 known vector',()=>assert.equal(execute('sha256_hash',{text:'abc'}).hex,'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'));
test('SHA-256 empty string',()=>assert.equal(execute('sha256_hash',{text:''}).hex,'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'));
test('Base64 Unicode round trip',()=>{const encoded=execute('base64_convert',{operation:'encode',text:'Hello 🌍'}).result;assert.equal(execute('base64_convert',{operation:'decode',text:encoded}).result,'Hello 🌍');});
test('Base64 invalid input',()=>assert.throws(()=>execute('base64_convert',{operation:'decode',text:'!'})));
test('Base64 rejects invalid UTF-8',()=>assert.throws(()=>execute('base64_convert',{operation:'decode',text:'/w=='})));
test('Base64 rejects unknown operation',()=>assert.throws(()=>execute('base64_convert',{operation:'other',text:'abc'})));
test('JSON pretty-print',()=>assert.equal(execute('json_format',{json:'{"a":1}'}).formatted,JSON.stringify({a:1},null,2)));
test('JSON minify',()=>assert.equal(execute('json_format',{json:'{ "a" : 1 }',indent:0}).formatted,'{"a":1}'));
test('JSON invalid indent',()=>assert.throws(()=>execute('json_format',{json:'{}',indent:9})));
test('JSON invalid input',()=>assert.throws(()=>execute('json_format',{json:'oops'})));
test('timestamp UTC ISO',()=>assert.deepEqual(execute('timestamp_convert',{value:'2026-01-01T00:00:00Z'}),{iso:'2026-01-01T00:00:00.000Z',unixSeconds:1767225600,unixMilliseconds:1767225600000}));
test('timestamp milliseconds',()=>assert.equal(execute('timestamp_convert',{value:0}).iso,'1970-01-01T00:00:00.000Z'));
test('timestamp timezone required',()=>assert.throws(()=>execute('timestamp_convert',{value:'2026-01-01'})));
test('timestamp invalid',()=>assert.throws(()=>execute('timestamp_convert',{value:'2026-99-99T00:00:00Z'})));

test('JSON Pointer root',()=>assert.deepEqual(execute('json_pointer',{json:'[1,2]',pointer:''}),{value:[1,2]}));
test('JSON Pointer nested path',()=>assert.deepEqual(execute('json_pointer',{json:'{"a":{"b":[10,20]}}',pointer:'/a/b/1'}),{value:20}));
test('JSON Pointer escaped keys',()=>assert.deepEqual(execute('json_pointer',{json:'{"a/b":{"~":true}}',pointer:'/a~1b/~0'}),{value:true}));
test('JSON Pointer rejects missing paths',()=>assert.throws(()=>execute('json_pointer',{json:'{}',pointer:'/missing'})));
test('JSON Pointer rejects invalid escape',()=>assert.throws(()=>execute('json_pointer',{json:'{}',pointer:'/bad~2'})));
test('JSON Pointer rejects invalid array index',()=>assert.throws(()=>execute('json_pointer',{json:'[1]',pointer:'/01'})));
test('URL component Unicode round trip',()=>{const encoded=execute('url_encode',{text:'hello world 🌍',operation:'encode'}).result;assert.equal(execute('url_encode',{text:encoded,operation:'decode'}).result,'hello world 🌍');});
test('URL component percent encoding',()=>assert.equal(execute('url_encode',{text:'a&b=c',operation:'encode'}).result,'a%26b%3Dc'));
test('URL component malformed escape',()=>assert.throws(()=>execute('url_encode',{text:'%ZZ',operation:'decode'})));
test('URL component unknown operation',()=>assert.throws(()=>execute('url_encode',{text:'a',operation:'wrong'})));
