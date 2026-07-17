# Enthalpy, C.A. — Sitio web corporativo

Sitio estático (HTML/CSS/JS, sin dependencias) de **Enthalpy, C.A.** — ingeniería térmica, eléctrica y obras de construcción. Maracaibo, Venezuela.

## Estructura

```
index.html          Página única (héroe, servicios, proyectos, nosotros, contacto)
css/styles.css      Sistema de diseño (paleta del logo, tipografía, responsive)
js/main.js          Interacciones (lente térmica, galería, lightbox, WhatsApp)
assets/img/         Fotos reales de proyectos + logo
v/                  Credenciales de personal (ver abajo)
robots.txt          Rastreo. No menciona /v/ a propósito
sitemap.xml         Solo la home
```

## Credenciales de personal (`/v/`)

Una página por trabajador, accesible **solo** por el QR de su carnet físico.
Sirve para que autoridades y clientes verifiquen la autenticidad del portador.

- La URL lleva un token aleatorio (`/v/EN-001-hbfsz6.html`) para que nadie
  pueda enumerar la plantilla probando EN-002, EN-003, etc.
- **Los tokens son permanentes.** Cambiarlos inutiliza los carnets ya impresos.
  La fuente de verdad está fuera del repo, en `Trabajadores/_registro.json`.
- No se enlazan desde `index.html` ni desde ningún sitio.
- Protegidas con `noindex` en cada página, `Options -Indexes` en `v/.htaccess`
  y un `v/index.html` que redirige a la home.

> **Este repositorio debe permanecer privado.** `/v/` contiene cédulas y
> fotografías de personas reales. En un repo público, el listado de archivos
> revelaría los seis tokens de una sola vez y anularía la protección.

Los generadores y el registro maestro viven en `Trabajadores/` (fuera del repo).
Ver `Trabajadores/LÉEME.md`.

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
