# Changelog

## v0.3.0 — 2026-11-14

### Added
- `json_pointer` supports RFC 6901 path lookup including escaped keys and array indices.
- `url_encode` encodes and decodes URL components with Unicode support.
- Ten new tests for successful and invalid inputs.

### Updated
- Nine discoverable MCP tools, Node.js 20+, no runtime dependencies.

## v0.2.0 — 2026-11-14

### Added
- `sha256_hash`: SHA-256 hexadecimal digest for UTF-8 text.
- `base64_convert`: strict Base64 encoding and UTF-8 decoding.
- `json_format`: pretty-print or minify JSON with configurable indentation.
- `timestamp_convert`: convert timezone-qualified ISO 8601 or Unix milliseconds into UTC ISO and Unix timestamps.
- Tests covering the new utilities and invalid inputs.

### Updated
- Seven MCP tools are now discoverable through `tools/list`.
- README includes Inspector instructions and input examples.
- Package and MCP server version updated to 0.2.0.

### Compatibility
- Node.js 20 or later; stdio transport; zero runtime dependencies.
- Not published to npm.
