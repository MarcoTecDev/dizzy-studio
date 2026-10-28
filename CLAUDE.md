# Dizzy Studio · notas para Claude

Tienda online de ropa (marca Dizzy Studio) hecha con HTML, CSS y JavaScript puros, sin frameworks ni build.
El propietario es Marco; háblale en español.

## Estructura
- `index.html`: una sola página con cuatro vistas: portada con el logo y los drops (`#home` o sin #),
  tienda de lana (`#inicio`), cápsula Rodeo (`#rodeo`, antes High Noon) y ficha de prenda (`#<id>` o
  `#<id>-<color>`). Arriba están la entrada de lana y la de la estrella. Cada drop tiene su propio menú y
  no enlaza al otro: se cambia de drop desde la portada.
- `css/styles.css`: tokens de color en `:root` (claro) y `:root[data-look="dark"]` (oscuro);
  el tema western usa `:root.theme-west`. Fuentes propias en `fonts/` con `@font-face`.
- `js/i18n.js`: textos en `en`, `es` y `zh`. Cualquier clave nueva va en los tres bloques.
- `js/main.js`: catálogo (array `P`), cesta, favoritos, rutas, scroll, entradas animadas.
- `img/`: todas las fotos en `.webp`, cada una con su versión pequeña en `sm/`
  (520 px productos, 640 px poses, 720 px lookbook, 900 px duelo).

## Reglas
- Sin librerías externas ni CDNs: todo debe funcionar abriendo `index.html` con doble clic.
- Inglés por defecto; los textos visibles salen de `i18n.js` (`data-i18n`, `data-i18n-html`, `data-i18n-attr`).
- Las animaciones respetan `prefers-reduced-motion` y el scroll lee medidas antes de escribir estilos.
- Probar en claro y oscuro, en los tres idiomas y a 390 px de ancho sin scroll horizontal.
- Las fotos de modelos y prendas están generadas con IA (Gemini).

## Git
- Rama principal `main`. Commits pequeños con mensaje en español que diga qué cambia.
- Todos los commits van solo a nombre de MarcoTecDev (`Marco <marcoanimation.com@gmail.com>`).
  Nunca añadir líneas `Co-Authored-By`, `Claude-Session` ni ningún otro autor o coautor: en GitHub solo
  debe salir MarcoTecDev como contribuidor.
- Antes de subir: revisar que no hay errores en la consola del navegador.
