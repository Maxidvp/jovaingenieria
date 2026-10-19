# Jova Ingeniería: sitio web

Sitio estático (HTML + CSS + JS, sin dependencias ni compilación) de **Jova Ingeniería**.
Presenta a la empresa como ingeniería integral, con todas las disciplinas y de la prefactibilidad a la
puesta en marcha, para minería de litio, oil & gas, tratamiento de agua e industria.

## Estructura

```
index.html            Versión en español (raíz del sitio)
en/index.html         Versión en inglés (/en/)
assets/css/styles.css Estilos (paleta, tipografía, responsive)
assets/js/main.js     Menú móvil, contadores, filtro de trayectoria, formulario
assets/fonts/         Fuentes autoalojadas (Barlow, Barlow Condensed, IBM Plex Mono, licencia OFL)
assets/img/           Logo, favicon e imágenes (ver assets/img/README.md)
```

## Secciones

1. **Hero**: propuesta de valor, diagrama unifilar animado e indicadores (+25 años, U$D 1.100M+, 5 plantas de litio, 7 países).
2. **Experiencia**: empresas para las que trabajó el director.
3. **Servicios**: ingeniería eléctrica (incluye salas eléctricas y VFD/soft starters), I&C, ingeniería de detalle y modelado BIM, ingeniería de procesos, comisionado, operación y mejora continua, gestión de proyectos y asesoría a empresas internacionales, más la franja de herramientas que maneja el equipo.
4. **Sectores**: litio, oil & gas, agua, industria y energía.
5. **Trayectoria**: proyectos en los que participó el equipo, filtrables por sector.
6. **Quién dirige**: perfil del Ing. Carlos Federico Flores, socio fundador.
7. **Contratos y suministros** (administración de contratos y cadena de suministro para obras),
   **Representación Aquatech** (soluciones de agua, ZLD y minerales críticos, con la plataforma PEARL para litio) y **Contacto**.

## Idiomas

- El selector **ES | EN** del encabezado cambia de versión, conserva la sección donde estaba el visitante
  y guarda su elección para las próximas visitas.
- En la primera visita, si el navegador no está en español, la portada redirige sola a `/en/`.
  No redirige si el visitante eligió un idioma, si navega dentro del sitio ni si es un buscador.
- Las etiquetas `hreflang` le indican a Google qué versión mostrar en cada idioma.
- **Al cambiar un texto, actualizar las dos páginas** (`index.html` y `en/index.html`). Las secciones
  tienen ids distintos en cada idioma (`#servicios` / `#services`, `#equipo` / `#team`, etc.); la equivalencia está en `assets/js/main.js`.

## Ver en local

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Pendiente antes de publicar

- [ ] Cargar las fotos indicadas en `assets/img/README.md` (fundador, sectores, imagen para redes).
- [ ] Validar con el Ing. Flores los datos públicos: montos, nombres de clientes y proyectos, y cifras del hero.
- [ ] Formulario: hoy abre el correo del visitante (`mailto:`). Para recibir los mensajes directamente,
      conectar un servicio como Formspree o un endpoint propio (ver `assets/js/main.js`).

## Publicación

Al ser estático, se puede subir tal cual a cualquier hosting (cPanel/FTP del hosting actual, Netlify,
Vercel, Cloudflare Pages o GitHub Pages) y apuntar `jovaingenieria.com.ar` al servidor.

### Firebase Hosting

El repo incluye `firebase.json`: publica la raíz y excluye los `.md`. Las fuentes y las imágenes se guardan en caché, mientras que el HTML, el CSS y el JS se revalidan en cada visita para que los cambios se vean enseguida.

```bash
npm install -g firebase-tools
firebase login
firebase use --add            # elegir el proyecto creado en console.firebase.google.com
firebase deploy --only hosting
# Link temporal para mostrar cambios sin tocar el sitio principal (vence a los 7 días):
firebase hosting:channel:deploy preview
```

Para que se publique solo en cada push: `firebase init hosting:github`
(crea el workflow de GitHub Actions y el secreto con la cuenta de servicio).
