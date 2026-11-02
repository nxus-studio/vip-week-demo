# Lemma MCP — Cómo usar las herramientas de este proyecto

El servidor MCP `lemma` recuerda entre sesiones y avisa cuando el código del que depende una memoria cambió. Úsalo en estos momentos:

## Disparadores

- Vas a investigar un bug, un error o un "¿por qué X?" → `mcp__lemma__search_memory` con el error o la pregunta.
- Un aviso 🧠 nombra memorias → `mcp__lemma__get_memory` de la primera.
- Un fix quedó verificado (tests pasan) → `mcp__lemma__store_memory` con `filePaths`: la causa raíz o la trampa, no un resumen del cambio.
- Terminas una sesión con trabajo a medias o por partes → `store_memory` (o `update_memory` si ya hay una) con lo HECHO, lo PENDIENTE y los nombres/firmas exactos de lo especificado; no resumas la especificación.
- Una memoria quedó desactualizada → `update_memory` (o `forget_memory`); no guardes otra al lado. Para añadir a una memoria larga (un índice vivo) usa `append`; para corregir un pasaje, `patch` `{find, replace}`; `response` reescribe todo y exige `get_memory` antes.
- Tests, build o lint con salida larga → `mcp__lemma__run_workspace_command`: devuelve los fallos y el resumen; el resto se abre con `output_region`.
- Código que aún no ubicaste o que puede tener secretos → `search_workspace` / `read_workspace_file`.

Si las tools de Lemma llegan diferidas (solo el nombre), cárgalas en una sola llamada a ToolSearch. Las demás están en `mcp__lemma__lemma_toolbox` (`list`, `schema`, `call`). No le pidas al usuario código que puedas leer tú. Si una respuesta viene de cache o de un archivo comprimido, dilo.

---
*Auto-generado por `lemma init` — @nxuss/lemma*
