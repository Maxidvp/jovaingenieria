# Jova Ingeniería: sitio web

Sitio estático (HTML + CSS + JS, sin dependencias ni compilación) de **Jova Ingeniería**, en español e inglés,
publicado en https://jovaingenieria.com.ar.
Presenta a la empresa como ingeniería integral, con todas las disciplinas y de la prefactibilidad a la
puesta en marcha, para minería de litio, oil & gas, tratamiento de agua e industria.

## Estructura

```
index.html                        Versión en español (raíz del sitio)
en/index.html                     Versión en inglés (/en/)
assets/css/styles.css             Estilos (paleta, tipografía, responsive)
assets/js/main.js                 Menú móvil, idioma, contadores, filtro de trayectoria, formulario
assets/fonts/                     Fuentes autoalojadas (Barlow, Barlow Condensed, IBM Plex Mono, licencia OFL)
assets/img/                       Logo, favicon, foto del fundador e imagen para redes (ver assets/img/README.md)
assets/img/companies/             Logos de clientes ya procesados; los originales y el script, en originales/
```

## Secciones

1. **Portada**: propuesta de valor, bases operativas (Salta, Bahía Blanca, Hernandarias y Houston) e indicadores
   (+25 años, U$D 9.000M+ en proyectos, 5 plantas de litio en la Puna, 9 países en 5 continentes).
2. **Experiencia en proyectos para**: banda con los logos de las empresas para las que trabajó el equipo.
3. **01 Servicios**: ingeniería eléctrica, instrumentación y control, ingeniería de detalle y modelado BIM,
   procesos, comisionado y puesta en marcha, operación y mejora continua, supervisión y gestión de proyectos,
   y asesoría para empresas internacionales, más la franja de herramientas que maneja el equipo.
4. **02 Sectores**: litio, oil & gas, agua, industria y energía.
5. **03 Trayectoria**: 18 proyectos en los que participó el equipo, filtrables por sector.
6. **04 Quién dirige**: perfil del Ing. Carlos Federico Flores, socio fundador.
7. **05 Contratos y suministros**: administración de contratos y cadena de suministro para obras.
8. **06 Representación Aquatech**: representación en Argentina y Paraguay (desalinización, reúso, ZLD,
   agua de producción, agua ultrapura, litio y minerales críticos).
9. **07 Contacto**: WhatsApp, teléfonos, correos y formulario. El botón flotante de WhatsApp acompaña todo el recorrido.

## Idiomas

- El selector **ES | EN** del encabezado cambia de versión, conserva la sección donde estaba el visitante
  y guarda su elección para las próximas visitas.
- En la primera visita, si el navegador no está en español, la portada redirige sola a `/en/`.
  No redirige si el visitante eligió un idioma, si navega dentro del sitio ni si es un buscador.
- Las etiquetas `hreflang` le indican a Google qué versión mostrar en cada idioma.
- **Al cambiar un texto, actualizar las dos páginas** (`index.html` y `en/index.html`). Las secciones
  tienen ids distintos en cada idioma (`#servicios` / `#services`, `#equipo` / `#team`, etc.); la equivalencia está en `assets/js/main.js`.
