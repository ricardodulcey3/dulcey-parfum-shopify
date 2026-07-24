# Dulcey Parfum — Tema Shopify

Tema completo de Shopify (Online Store 2.0 / Liquid) con el mismo diseño y animaciones del sitio original, pero conectado a productos, carrito y checkout reales de Shopify.

## 1. Subir el tema

1. En tu panel de Shopify: **Online Store → Themes**.
2. Botón **Add theme → Upload zip file**.
3. Sube `dulcey-parfum-shopify-theme.zip`.
4. Cuando termine de subir, en el tema aparece un botón **Publish** para ponerlo en vivo (puedes dejarlo sin publicar y revisarlo primero con "Preview").

## 2. Configurar los ajustes del tema

En **Online Store → Themes → Customize → Configuración del tema** (panel izquierdo, ícono de engranaje):

- **Marca**: nombre del logo (2 palabras), número de WhatsApp (solo dígitos + código de país, ej. `573001234567`), mostrar/ocultar botón flotante.
- **Colores**: ya vienen con la paleta original (dorado/negro/crema), edítalos si quieres.
- **Redes sociales**: URLs de Instagram/Facebook/TikTok.

## 3. Crear los productos con las etiquetas correctas

El filtro del catálogo (Floral / Amaderado / Cítrico / Oriental) y las 3 tarjetas de "Colecciones" (Árabes / Diseñador / Nicho) funcionan por **tags de producto**, no por categorías nuevas. Al crear cada producto en **Products → Add product**, agrégale un tag exacto según su familia olfativa:

- `floral`
- `amaderado`
- `citrico`
- `oriental`

Opcional — para mostrar una insignia como "Más vendido" en la tarjeta, añade un tag con el formato `badge:Más vendido` (el texto después de `badge:` es lo que se muestra).

El precio tachado con descuento aparece automáticamente si le pones un **Compare-at price** mayor al precio de venta.

## 4. Crear las colecciones

Crea 3 colecciones (**Products → Collections → Create collection**), una por cada etiqueta, con condición automática `Product tag is floral` (y lo mismo para `amaderado`, `citrico`, `oriental` — o agrupa como prefieras). Luego:

- En el editor de temas, sección **Catálogo destacado** (home): elige qué colección mostrar ahí.
- En la sección **Colecciones** (las 3 tarjetas): cada tarjeta tiene un selector de "Colección vinculada" para que el botón "Descubrir" lleve a la colección real.

## 5. Envíos

Esto se configura aparte, en **Settings → Shipping and delivery** (no es parte del tema): recogida en tienda, entrega local y/o tarifas de transportadora, usando tu tienda física como ubicación de origen.

## Estructura del tema

- `layout/theme.liquid` — envoltorio HTML, carga `theme.css`/`theme.js`, botón flotante de WhatsApp.
- `sections/` — un archivo por bloque de la home (hero, marquee, manifiesto, colecciones, catálogo, nosotros, filosofía, contacto) más las páginas de producto/colección/carrito/404/búsqueda. Todas son editables desde el personalizador de temas.
- `snippets/product-card.liquid` — tarjeta de producto reutilizada en home, colección y búsqueda.
- `templates/*.json` — arman qué secciones aparecen en cada tipo de página.
- `assets/theme.css` / `assets/theme.js` — mismo sistema de animaciones del sitio original (scroll reveal por `data-animate`, contadores animados, marquee infinito), más el carrito real vía `fetch` a `/cart/add.js`.
