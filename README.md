# vip-week-demo

`orders-service`, un servicio de pedidos ficticio para probar [Lemma](https://www.npmjs.com/package/@nxuss/lemma),
la memoria verificable para agentes de código. Sus bugs están plantados a propósito, para que todos vean
lo mismo.

```bash
npm ci && npm test
```

El repo ya trae la configuración que genera `lemma init` (`.mcp.json`, `CLAUDE.md`, `AGENTS.md` y
reglas de Cursor, Windsurf y Kiro). En tu propio proyecto la generas con `npm i -g @nxuss/lemma` y
`lemma init`.

MIT. El código de `src/` es ficticio.
