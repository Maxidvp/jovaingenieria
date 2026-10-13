# Jova Ingeniería: sitio web

Sitio estático (HTML + CSS + JS, sin dependencias ni compilación) de **Jova Ingeniería**.
Está orientado al perfil del socio fundador: ingeniería eléctrica, instrumentación y control (E&IC)
para minería de litio, oil & gas, tratamiento de agua e industria.

## Estructura

```
index.html            Página única con todas las secciones
assets/css/styles.css Estilos (paleta, tipografía, responsive)
assets/js/main.js     Menú móvil, contadores, filtro de trayectoria, formulario
assets/fonts/         Fuentes autoalojadas (Barlow, Barlow Condensed, IBM Plex Mono, licencia OFL)
assets/img/           Imágenes (ver assets/img/README.md)
```

## Secciones

1. **Hero**: propuesta de valor E&IC, diagrama unifilar animado e indicadores (+25 años, U$D 1.100M+, 3 plantas de litio, 7 países).
2. **Experiencia**: empresas para las que trabajó el director.
3. **Servicios**: ingeniería eléctrica, I&C, VFD/soft starters, comisionado, gestión de proyectos y asesoría a empresas internacionales.
4. **Sectores**: litio, oil & gas, agua, industria y energía.
5. **Trayectoria**: proyectos del director, filtrables por sector.
6. **Fundador**: perfil del Ing. Carlos Federico Flores.
7. **Por qué Jova**, **Suministros**, **Contacto**.

## Ver en local

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Pendiente antes de publicar

- [ ] Reemplazar el logo provisorio (SVG en línea en `index.html`, header y footer) por el logo vectorial oficial.
- [ ] Cargar las fotos indicadas en `assets/img/README.md` (fundador, sectores, imagen para redes).
- [ ] Validar con el Ing. Flores los datos públicos: montos, nombres de clientes y proyectos, y cifras del hero.
- [ ] Formulario: hoy abre el correo del visitante (`mailto:`). Para recibir los mensajes directamente,
      conectar un servicio como Formspree o un endpoint propio (ver `assets/js/main.js`).
- [ ] Opcional: versión en inglés para EPC y proveedores del exterior.

## Publicación

Al ser estático, se puede subir tal cual a cualquier hosting (cPanel/FTP del hosting actual, Netlify,
Vercel, Cloudflare Pages o GitHub Pages) y apuntar `jovaingenieria.com.ar` al servidor.
