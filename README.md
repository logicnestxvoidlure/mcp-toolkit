# MCP Toolkit

A small, open-source **Model Context Protocol (MCP)** server providing developer utilities over stdio. Zero runtime dependencies; Node.js 20+.

**Current version: v0.2.0** — seven local tools, zero runtime dependencies.

## Tools

| Tool | Purpose |
| --- | --- |
| `json_inspect` | Validate JSON and report the value type, object keys, or array length |
| `text_analyze` | Count Unicode characters, words, and lines |
| `url_inspect` | Parse an HTTP(S) URL without fetching it |
| `sha256_hash` | Compute SHA-256 of UTF-8 text (hex output) |
| `base64_convert` | Encode UTF-8 or decode strict Base64 UTF-8; `operation` is `encode` or `decode` |
| `json_format` | Format JSON with `indent` from 0 (minified) to 8 (default 2) |
| `timestamp_convert` | Convert timezone-qualified ISO 8601 strings or Unix **milliseconds** into UTC ISO and Unix seconds/milliseconds |

## Quick start

```bash
git clone https://github.com/logicnestxvoidlure/mcp-toolkit.git
cd mcp-toolkit
npm test
npm start
```

Configure a local MCP client to launch the server over **stdio** (replace with the absolute path of your checkout):

```json
{
  "mcpServers": {
    "mcp-toolkit": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-toolkit/src/server.js"]
    }
  }
}
```

The server handles MCP JSON-RPC 2.0 messages over newline-delimited stdio, with `initialize`, `ping`, `tools/list`, and `tools/call`. The supported protocol version is `2025-03-26`. HTTP transport is not implemented.

## Try a tool

Using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector):

```bash
npx @modelcontextprotocol/inspector node src/server.js
```

Connect using stdio, list tools, and call `sha256_hash` with `{ "text": "abc" }`. The resulting SHA-256 hex digest starts with `ba7816bf`.

`url_inspect` only parses URLs and never makes network requests. `timestamp_convert` requires a timezone in ISO strings; numeric timestamps are Unix milliseconds. Base64 decoding rejects malformed Base64 and invalid UTF-8.

## Development

Run `npm test` (Node.js 20+). GitHub Actions tests Node.js 20, 22, and 24. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Roadmap

- More developer integrations and better argument validation
- Better MCP compliance and integration tests
- npm publishing after release validation

## Security

Tools run locally, do not fetch URLs, and do not send input to external services. Avoid passing secrets to third-party MCP clients. Stdout is reserved for protocol messages.

## License

[MIT](LICENSE)
