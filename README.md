# Enthalpy, C.A. — Sitio web corporativo

Sitio estático (HTML/CSS/JS, sin dependencias) de **Enthalpy, C.A.** — ingeniería térmica, eléctrica y obras de construcción. Maracaibo, Venezuela.

## Estructura

```
index.html          Página única (héroe, servicios, proyectos, nosotros, contacto)
css/styles.css      Sistema de diseño (paleta del logo, tipografía, responsive)
js/main.js          Interacciones (lente térmica, galería, lightbox, WhatsApp)
assets/img/         Fotos reales de proyectos + logo
```

## Desarrollo local

No necesita build. Cualquier servidor estático sirve:

```bash
npx serve .
```

## Publicación

Subir el contenido completo de esta carpeta a la raíz pública del hosting
(`public_html` en cPanel). No hay proceso de compilación.

## Datos de contacto del sitio

Si cambian teléfono o correo, buscar y reemplazar en `index.html`:

- WhatsApp/Tel: `584226741108` (enlaces) y `0422-674.11.08` (texto visible)
- Correo: `administracion@enthalpyca.com`
