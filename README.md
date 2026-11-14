# MCP Toolkit

A small, open-source **Model Context Protocol (MCP)** server providing developer utilities over stdio. Zero runtime dependencies; Node.js 20+.

## Tools

| Tool | Purpose |
| --- | --- |
| `json_inspect` | Validate JSON and report the value type, object keys, or array length |
| `text_analyze` | Count Unicode characters, words, and lines |
| `url_inspect` | Parse an HTTP(S) URL without fetching it |

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

## Development

Run `npm test` (Node.js 20+). GitHub Actions tests Node.js 20, 22, and 24. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Roadmap

- Additional JSON and string utilities
- Better MCP compliance and integration tests
- npm publishing after release validation

## Security

Tools run locally, do not fetch URLs, and do not send input to external services. Avoid passing secrets to third-party MCP clients. Stdout is reserved for protocol messages.

## License

[MIT](LICENSE)
