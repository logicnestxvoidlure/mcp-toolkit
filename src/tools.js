export const definitions = [
  { name: 'json_inspect', description: 'Validate JSON and inspect its structure.', inputSchema: {type:'object',properties:{json:{type:'string',description:'JSON string to inspect'}},required:['json'],additionalProperties:false}},
  { name: 'text_analyze', description: 'Count words, characters, and lines in text.', inputSchema: {type:'object',properties:{text:{type:'string'}},required:['text'],additionalProperties:false}},
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
  if (name === 'url_inspect') {
    if (typeof args.url !== 'string') throw new Error('url must be a string');
    let url;
    try { url=new URL(args.url); } catch {throw new Error('Invalid URL');}
    if (!['https:','http:'].includes(url.protocol)) throw new Error('Only HTTP(S) URLs are supported');
    return {protocol:url.protocol,hostname:url.hostname,port:url.port,path:url.pathname,query:Object.fromEntries(url.searchParams),hash:url.hash};
  }
  throw new Error('Unknown tool: '+name);
}
