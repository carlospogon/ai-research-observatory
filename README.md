# AI Research Observatory

Observatorio divulgativo e interactivo de investigación en inteligencia artificial.

## Publicación
Para habilitar GitHub Pages: **Settings → Pages → Build and deployment → Deploy from a branch → main → /(root)**.
URL prevista: https://carlospogon.github.io/ai-research-observatory/

## Automatización real
GitHub Actions ejecuta `scripts/discover.py` cada día a las 09:15 UTC y obtiene candidatos de arXiv publicados o actualizados en los últimos siete días. Si cambia la selección de candidatos, crea un commit en `data/candidates.json`. Puede haber retrasos en la programación.

**No confundir descubrimiento con validación científica.** Los candidatos no se publican como artículos seleccionados. `data/papers.json` contiene fichas editoriales revisadas manualmente. El workflow actual no llama a modelos de IA, no verifica resultados, no asigna notas y no crea simulaciones.

## Archivos
- `index.html`: web con filtros, tres simuladores y preguntas de autoevaluación.
- `data/papers.json`: investigaciones seleccionadas.
- `data/candidates.json`: candidatos pendientes de revisión (se genera automáticamente).
- `scripts/discover.py`: extracción de metadatos arXiv.
- `.github/workflows/daily.yml`: automatización de candidatos.

## Criterios editoriales
Novedad (0–3), solidez (0–2), evidencia (0–2), importancia (0–2), reproducibilidad (0–1). Umbral habitual ≥7/10. Las puntuaciones son valoraciones editoriales, no resultados de un benchmark.

## Desarrollo local
`python -m http.server 8000` y visitar http://localhost:8000.
