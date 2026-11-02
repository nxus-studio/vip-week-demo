---
name: lemma
description: Lemma — cache semántico, firewall de privacidad y memoria cross-sesión para Muse. Usa `lemma call <tool>` vía bash para acceder a 70+ tools sin MCP nativo. Cárgala al iniciar cada sesión: search_memory antes de razonar, store_memory al verificar una solución.
user-invocable: true
allowed-tools: bash
---

# Lemma para Muse

Eres Muse Code (muse-spark). Tienes **Lemma MCP** disponible — gateway de caché semántica, firewall de privacidad y memoria persistente. Muse no expone MCP nativamente, así que llamas a Lemma vía **CLI `lemma call`** (wrapper sobre `mcp-server.js` por stdio) + **proxy local**.

## Qué es Lemma

- **Proxy local** en `http://localhost:8081` — cachea respuestas LLM (BM25 + embeddings), ahorra tokens/dinero.
- **Brain persistente** en `~/.lemma-cache/lemma_brain.json` + memoria por proyecto.
- **MCP server** con 70+ tools — las mismas que usan Claude Code / Cursor / Codex, aquí vía `lemma call`.

> **Nota de compatibilidad:** Este skill NO afecta a Claude Code, Cursor, Codex ni otros CLIs con MCP nativo. Ellos siguen usando `mcp__lemma__*` directo. Las reglas globales de `AGENTS.md` (MANDATORY RULES) aplican a clientes con MCP nativo; si eres Muse, **este skill tiene prioridad** sobre `AGENTS.md` para decidir cuándo usar Lemma.

## Cuándo usar Lemma (Muse)

| Tarea | Qué hacer con Lemma |
|---|---|
| Pregunta que puede estar ya resuelta | `search_memory` antes de razonar |
| Pregunta atada a archivos concretos (mismo prompt + mismos archivos) | `state_hash_cache` con `action=lookup` antes, `store` después |
| Conocimiento que debe sobrevivir sesiones | `search_memory` / `store_memory` (con `derivedFrom`) |
| Leer/listar/buscar workspace | Usa tus tools nativos (`read_file`, `bash ls/grep`) — Lemma añade scrubbing si lo llamas, pero no es obligatorio |
| Tarea mecánica → decidir modelo barato | `get_routing_advice` |
| Aplicar patch | `validate_patch_sandbox` primero |
| "¿Cuánto ahorramos?" | `token_receipt` |

Si Lemma no encaja, usa tu tool nativo. No fuerces Lemma donde no aporta.

## Cómo llamar a Lemma desde Muse (preferido)

Usa el wrapper `lemma call` — evita craft de JSON-RPC manual y escapa args por ti. Está disponible como `lemma call` (instalación global por npm), `npx @nxuss/lemma call`, o local `node ./lemma-proxy.cjs call` / `node ./bin/lemma-call.js`.

```bash
# 1. Lookup en memoria antes de razonar (preferido — wrapper)
lemma call search_memory --query "tu pregunta"
# o JSON explícito:
lemma call search_memory '{"query":"tu pregunta"}'
# (en este repo también vale: node ./lemma-proxy.cjs call search_memory --query "tu pregunta")

# 2. Busca en workspace (con scrubbing)
lemma call search_workspace --query "texto" --maxResults 10

# 3. Guarda solución verificada
lemma call store_memory '{"content":"solución verificada","tags":["bugfix"]}'

# 4. Lista tools disponibles
node ./lemma-proxy.cjs call --list

# Pipe también funciona:
echo '{"query":"hello"}' | node ./bin/lemma-call.js search_memory
```

**Alternativa raw (solo si el wrapper no está disponible):**

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search_memory","arguments":{"query":"tu pregunta"}}}' | node ./mcp-server.js
```

Para tráfico LLM real (cache del proxy), asegúrate que el daemon corre:

```bash
node ./lemma-proxy.cjs status
node ./lemma-proxy.cjs start
```

## Cero config en este repo

Si clonaste `lemma` y lo abriste con Muse, **no necesitas correr ningún comando**. Este repo ya trae:
- `.agents/skills/lemma/SKILL.md` (este archivo) — Muse lo detecta al abrir el workspace
- `AGENTS.md` con guard clause para Muse
- `bin/lemma-call.js` + `lemma-proxy.cjs call` (wrapper sin JSON manual)
- `mcp-server.js` como fallback sin build

Muse te pedirá confiar el workspace la primera vez (prompt interactivo). Una vez que aceptas, el skill queda activo automáticamente — sin `lemma init`, sin `npm run build` manual. Para uso total (70+ tools) el wrapper resuelve `dist/cjs/mcp/index.js` → `mcp-server.js`; si `dist` no existe se auto-construye o usa el fallback con las tools core.

## Sandbox y permisos

Muse corre con sandbox por workspace. El proxy (`localhost:8081`) y el brain (`~/.lemma-cache/`) están **fuera** del workspace, así que:

- La primera vez Muse pregunta si confías el workspace — di que sí. Después queda recordado, no necesitas `--trust-workspace` manual cada vez (solo si lo abres con flag explícito).
- Si ves `permission denied`, acepta el trust prompt y re-intenta; no necesitas `--disable-sandbox`.
- El wrapper prioriza `dist/cjs/mcp/index.js` y cae a `mcp-server.js` si aún no hay build — cero pasos extra.

## Flujo obligatorio al iniciar sesión

1. Llama `search_memory` vía `lemma call` con el tema de la tarea.
2. Si hay hit, verifícalo contra el código actual antes de presentarlo.
3. Al terminar con solución verificada (tests pasaron), llama `store_memory` vía `lemma call`.

## Flujo para bugs

1. `get_telepathic_hints` vía `lemma call` si necesitas contexto de runtime.
2. `search_memory` con el mensaje de error.

## Regla dura

Si tu respuesta viene de un cache hit, dilo explícitamente: "esto viene de memoria cacheada". Nunca presentes un hit como razonamiento fresco. Y nunca guardes una solución no verificada.

## Verificación (opcional)

En este repo no necesitas instalar nada — ya está listo. Solo si quieres verificar:

```bash
# Wrapper responde (sin JSON manual)
node ./lemma-proxy.cjs call --list | head -c 500
node ./lemma-proxy.cjs call get_project_onboarding '{}' | head -c 800

# Proxy (solo si usas cache de tráfico LLM)
node ./lemma-proxy.cjs status
```

Para **otros proyectos** (no este repo), instala Lemma una vez:

```bash
npx @nxuss/lemma init   # genera .agents/skills/lemma/SKILL.md + AGENTS.md en ese proyecto
# o
npm i -D @nxuss/lemma && npx lemma init
```

> Generado por `lemma init` — @nxuss/lemma para Muse.
<!-- managed by lemma init (@nxuss/lemma): re-run lemma init after upgrading to refresh -->
