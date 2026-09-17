# Landing Template

Plantilla base de Zonodev para armar landing pages rápido. Es un fork de una
landing real (React + TypeScript + Vite) al que se le sacó toda la marca y
todo el backend, para poder arrancar un proyecto nuevo desde acá.

No tiene backend: no hay Supabase, ni ninguna otra base de datos. Todo el
contenido (cursos/eventos/noticias, sponsors, redes sociales, envíos de
formularios de ejemplo) vive como datos estáticos en `src/data/`. Los hooks
en `src/hooks/` (`useSupabaseTable`, `useSupabaseItem`, `useSponsors`,
`useSocialLinks`, `useFormSubmissions`) leen esos arrays y, en el caso del
admin, mutan un `useState` en memoria — cualquier alta/edición/baja que
hagas en `/admin` sólo dura mientras esté montado ese componente, no se
guarda en ningún lado ni sobrevive a un refresh.

## Cómo correrla

```bash
npm install
npm run dev       # servidor de desarrollo (Vite)
npm run build     # typecheck (tsc -b) + build de producción
npm run lint      # eslint .
npm run preview   # sirve el build de producción localmente
```

## Cómo personalizarla para un cliente nuevo

- **Colores**: todos los tokens de tema (`--color-bg`, `--color-accent`,
  `--font-heading`, etc.) están definidos una sola vez en `src/index.css`.
  Cambiá los valores ahí y se propagan a todo el sitio.
- **Textos e imágenes**: buscá "Tu Marca" y "tu-dominio.com" en el código
  (`index.html`, `src/components/Seo/Seo.tsx`, `GlobalHeader`, `AlmaFooter`,
  `Home.tsx`, `Hero.tsx`, `SlidesSection.tsx`) y reemplazalos por el nombre y
  dominio reales del cliente.
- **Imágenes placeholder**: todo lo que hoy apunta a
  `/images/placeholder/*.svg` (hero, logo, tarjetas de contenido, sponsors,
  imágenes de la sección "Historia") es un SVG gris genérico hecho a mano.
  Reemplazá esos archivos en `public/images/placeholder/` (o cambiá las
  rutas en el código) por las imágenes reales del proyecto.
- **Contenido**: editá `src/data/content.ts`, `src/data/sponsors.ts`,
  `src/data/socialLinks.ts` y `src/data/formSubmissions.ts` para cargar los
  datos reales, o conectá los hooks a un backend real si el proyecto lo
  necesita.

## Sobre `/admin`

`/admin/login` y `/admin` son una demo visual del panel de administración
original. El login (`AuthContext.tsx`) acepta cualquier email/contraseña no
vacíos y guarda una sesión falsa en `sessionStorage` — no hay autenticación
real. Las secciones de CRUD funcionan sobre el estado en memoria descrito
arriba: se ven y se sienten funcionales durante la sesión, pero no persisten
nada. Como en el proyecto original, no hay ningún link visible a `/admin`
en la UI pública.
