import { createHash } from 'node:crypto';

export const definitions = [
  { name: 'json_inspect', description: 'Validate JSON and inspect its structure.', inputSchema: {type:'object',properties:{json:{type:'string',description:'JSON string to inspect'}},required:['json'],additionalProperties:false}},
  { name: 'text_analyze', description: 'Count words, characters, and lines in text.', inputSchema: {type:'object',properties:{text:{type:'string'}},required:['text'],additionalProperties:false}},
  { name: 'sha256_hash', description: 'Compute a SHA-256 hex digest for UTF-8 text.', inputSchema: {type:'object',properties:{text:{type:'string'}},required:['text'],additionalProperties:false}},
  { name: 'base64_convert', description: 'Encode UTF-8 text to Base64 or decode strict Base64 into UTF-8.', inputSchema: {type:'object',properties:{text:{type:'string'},operation:{type:'string',enum:['encode','decode']}},required:['text','operation'],additionalProperties:false}},
  { name: 'json_format', description: 'Pretty-print or minify a JSON string.', inputSchema: {type:'object',properties:{json:{type:'string'},indent:{type:'integer',minimum:0,maximum:8}},required:['json'],additionalProperties:false}},
  { name: 'timestamp_convert', description: 'Convert an ISO 8601 timestamp or Unix milliseconds to UTC ISO and Unix seconds/milliseconds.', inputSchema: {type:'object',properties:{value:{oneOf:[{type:'string'},{type:'number'}]}},required:['value'],additionalProperties:false}},
  { name: 'url_inspect', description: 'Parse an HTTP(S) URL without fetching it.', inputSchema: {type:'object',properties:{url:{type:'string'}},required:['url'],additionalProperties:false}}
];
function typeOf(value) {return value===null?'null':Array.isArray(value)?'array':typeof value;}
export function execute(name, args={}) {
  if (!args || typeof args !== 'object' || Array.isArray(args)) throw new Error('Arguments must be an object');
  if (name === 'json_inspect') {
    if (typeof args.json !== 'string') throw new Error('json must be a string');
    const value=JSON.parse(args.json);
    return {valid:true,type:typeOf(value), ...(Array.isArray(value)?{length:value.length}:value&&typeof value==='object'?{keys:Object.keys(value),keyCount:Object.keys(value).length}:{})};
  }
  if (name === 'text_analyze') {
    if (typeof args.text !== 'string') throw new Error('text must be a string');
    const text=args.text;
    return {characters:[...text].length, words:text.trim()?text.trim().split(/\s+/u).length:0, lines:text===''?0:text.split(/\r\n|\n|\r/u).length};
  }
  if (name === 'sha256_hash') {
    if (typeof args.text !== 'string') throw new Error('text must be a string');
    return {algorithm:'sha256',hex:createHash('sha256').update(args.text,'utf8').digest('hex')};
  }
  if (name === 'base64_convert') {
    if (typeof args.text !== 'string') throw new Error('text must be a string');
    if (args.operation === 'encode') return {operation:'encode',result:Buffer.from(args.text,'utf8').toString('base64')};
    if (args.operation !== 'decode') throw new Error('operation must be encode or decode');
    if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(args.text)) throw new Error('Invalid Base64');
    const bytes=Buffer.from(args.text,'base64');
    if (bytes.toString('base64') !== args.text) throw new Error('Invalid Base64');
    const result=new TextDecoder('utf-8',{fatal:true}).decode(bytes);
    return {operation:'decode',result};
  }
  if (name === 'json_format') {
    if (typeof args.json !== 'string') throw new Error('json must be a string');
    const indent=args.indent ?? 2;
    if (!Number.isInteger(indent) || indent < 0 || indent > 8) throw new Error('indent must be an integer from 0 to 8');
    return {formatted:JSON.stringify(JSON.parse(args.json),null,indent)};
  }
  if (name === 'timestamp_convert') {
    if (typeof args.value !== 'string' && typeof args.value !== 'number') throw new Error('value must be an ISO string or Unix milliseconds');
    if (typeof args.value === 'string' && !/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?(?:Z|[+-]\\d{2}:\\d{2})$/.test(args.value)) throw new Error('Provide an ISO 8601 timestamp with timezone');
    const date=new Date(args.value);
    if (!Number.isFinite(date.getTime())) throw new Error('Invalid timestamp');
    return {iso:date.toISOString(),unixSeconds:Math.floor(date.getTime()/1000),unixMilliseconds:date.getTime()};
  }
  if (name === 'url_inspect') {
    if (typeof args.url !== 'string') throw new Error('url must be a string');
    let url;
    try { url=new URL(args.url); } catch {throw new Error('Invalid URL');}
    if (!['https:','http:'].includes(url.protocol)) throw new Error('Only HTTP(S) URLs are supported');
    return {protocol:url.protocol,hostname:url.hostname,port:url.port,path:url.pathname,query:Object.fromEntries(url.searchParams),hash:url.hash};
  }
  throw new Error('Unknown tool: '+name);
}
