# Instrucciones para trabajar en pronux-web

## Regla principal: nunca publicar sin autorización

- **No hagas `git push` ni publiques en Netlify sin autorización explícita de Pablo.** Cada push a `main` dispara un deploy en Netlify y consume créditos del plan.
- Hacé los cambios, revisalos localmente y mostrale a Pablo qué cambió. Subí solo cuando él diga "subilo".
- Agrupá varios cambios en una sola subida.
- Si un commit no cambia nada de la web (por ejemplo, solo documentación), poné `[skip netlify]` en el mensaje para que Netlify no despliegue.

## Qué es este repo

Web de ProNux (webs a medida para comercios y pymes), publicada en https://pronux.netlify.app desde la rama `main`.

Sitio estático, sin compilación ni dependencias:

- `index.html`, `servicios.html`, `trabajos.html`, `nosotros.html`, `planes.html`, `contacto.html`: páginas. El menú, el pie y el botón de WhatsApp se repiten en cada una: si cambiás uno, cambialo en las seis.
- `css/estilos.css`: estilos compartidos (colores de marca: negro azulado `#0E1630`/`#0B1229`, azul `#2F6BFF`, blanco).
- `js/main.js`: animaciones e interacción. Cada bloque se activa solo si su sección existe en la página.
- `img/`: capturas, favicon e imagen para compartir (`og-pronux.png`, 1200×630).
- `marca/`: logo en SVG y PNG.

WhatsApp de contacto: +54 9 11 6979-3535 (`https://wa.me/5491169793535`).

## Cómo trabajar con Pablo

- Respondé en español rioplatense, directo y sin relleno.
- Antes de cambiar algo que no pidió, consultale.
- Revisá en computadora y en celular antes de proponer subir.
