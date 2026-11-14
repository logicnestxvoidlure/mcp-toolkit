# Contributing

Thanks for helping improve MCP Toolkit.

1. Open an issue describing a bug or feature before major changes.
2. Fork the repository and create a focused branch.
3. Run `npm test` using Node.js 20 or newer.
4. Add tests for new tools and update README documentation.
5. Open a pull request explaining the change, its tests, and compatibility concerns.

## Development standards

Keep tools deterministic, validate arguments, and avoid logging to stdout (reserved for MCP messages). Never execute untrusted user-provided code. Do not add network access or filesystem writes without explicit documentation and tests. Be respectful in discussions and code review.
