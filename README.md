# AutomaScore

Medidor de automatizabilidad de [AI-Q](https://ai-q.fit): el visitante describe un problema y recibe un puntaje y ejemplos del catálogo de soluciones.

- `site/`: página estática (Cloudflare Pages, directorio de salida `site`).
- `worker/`: backend en Cloudflare Workers (`wrangler deploy`). La clave de API va como secreto: `wrangler secret put ANTHROPIC_API_KEY`. Nunca se commitea.
