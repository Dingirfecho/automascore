#!/usr/bin/env bash
# Estadísticas anónimas de AutomaScore (Workers Analytics Engine).
# Uso:  CF_ACCOUNT_ID=xxxx CF_API_TOKEN=yyyy ./stats.sh
# El token es uno personalizado con permiso: Account > Account Analytics > Read.
# No hay texto, IP ni identificadores: solo conteos por día, idioma, país y nivel.
set -euo pipefail
: "${CF_ACCOUNT_ID:?Falta CF_ACCOUNT_ID}" "${CF_API_TOKEN:?Falta CF_API_TOKEN}"
URL="https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/analytics_engine/sql"
q() { echo; echo "== $1"; curl -sS "$URL" -H "Authorization: Bearer ${CF_API_TOKEN}" --data "$2"; echo; }

q "Evaluaciones por día (últimos 30 días)" \
"SELECT toDate(timestamp) AS dia, SUM(_sample_interval) AS evaluaciones
 FROM automascore WHERE blob2 = 'ok' AND timestamp > NOW() - INTERVAL '30' DAY
 GROUP BY dia ORDER BY dia DESC FORMAT JSONEachRow"

q "Total histórico" \
"SELECT SUM(_sample_interval) AS evaluaciones, SUMIf(_sample_interval, blob2 = 'pregunta') AS pidieron_mas_datos
 FROM automascore FORMAT JSONEachRow"

q "Por país" \
"SELECT blob4 AS pais, SUM(_sample_interval) AS n FROM automascore WHERE blob2 = 'ok'
 GROUP BY pais ORDER BY n DESC LIMIT 15 FORMAT JSONEachRow"

q "Por idioma y nivel" \
"SELECT blob1 AS idioma, blob3 AS nivel, SUM(_sample_interval) AS n FROM automascore WHERE blob2 = 'ok'
 GROUP BY idioma, nivel ORDER BY n DESC FORMAT JSONEachRow"
