# Maqueta · Concesionaria de usados

Maqueta de Zonodev para presentar a concesionarias de autos usados. Está
armada sobre la plantilla base de landing pages (React + TypeScript + Vite):
secciones de **Usados destacados**, **Motos** y **Utilitarios**, un llamado
a "ver todo el stock" que lleva a `/stock` (catálogo completo con filtros por
categoría y orden por precio/kilómetros), ficha de cada unidad con formulario
de consulta, grilla de **marcas con las que se trabaja** y panel admin demo.
La concesionaria es genérica ("Tu Concesionaria") para poder adaptarla a
cada cliente.

No tiene backend: no hay Supabase, ni ninguna otra base de datos. Todo el
contenido (unidades, marcas, redes sociales, consultas de ejemplo) vive
como datos estáticos en `src/data/`. Los hooks
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
  `--font-heading`, etc.) están definidos una sola vez en `src/index.css`
  (tema claro: azul como color de marca y naranja para los botones de
  venta). Los colores con transparencia usan el token `-rgb` que está al
  lado (`--color-accent-rgb`, etc.): si cambiás un color, cambiá los dos y
  se propaga a todo el sitio.
- **Textos**: buscá "Tu Concesionaria", "tuconcesionaria.com.ar",
  "Av. Ejemplo" y "tu-dominio.com" en el código (`index.html`,
  `src/components/Seo/Seo.tsx`, `GlobalHeader`, `AlmaFooter`, `Home.tsx`,
  `Hero.tsx`, `SlidesSection.tsx`) y reemplazalos por los datos reales.
- **Imágenes**: todas las imágenes son placeholders grises que indican
  qué archivo son. Reemplazá cada archivo por el real **con el mismo
  nombre** y no hace falta tocar código:
  - `public/images/stock/usados/`, `motos/` y `utilitarios/`: una foto por
    unidad, llamada como el `id` de la unidad en `src/data/content.ts`
    (por ejemplo `stock/usados/toyota-corolla-2021.jpg`). Recomendado
    1200 × 750 px. Hoy tienen fotos de ejemplo de Wikimedia Commons con
    licencia libre; sus autores figuran en `/creditos`
    (`src/data/photoCredits.ts`). Cuando reemplaces una por la foto real,
    borrá su entrada de ese archivo.
  - `public/images/marcas/`: logos de las marcas (`toyota.png`,
    `volkswagen.png`, …). Sirven PNG con fondo transparente de cualquier
    proporción.
  - `public/images/sitio/`: `logo.png`, `portada.jpg` (fondo del inicio),
    `tomamos-tu-usado.jpg` (banner vertical) e `historia-1/2/3.jpg`.

  Si una imagen real tiene otra extensión (por ejemplo `.webp`), cambiá
  también la ruta en el código.
- **Stock y marcas**: editá `src/data/content.ts` (unidades: título, año,
  km, precio en US$, fecha de publicación, vendido o no),
  `src/data/sponsors.ts` (marcas), `src/data/socialLinks.ts` y
  `src/data/formSubmissions.ts`, o conectá los hooks a un backend real si
  el proyecto lo necesita.
- **Precios en pesos**: los precios se cargan siempre en US$, pero las
  unidades de menos de US$ 25.000 se muestran convertidas a pesos. La
  cotización es `ARS_PER_USD` en `src/lib/contentMapping.ts`: actualizala
  cuando cambie el dólar.

## Sobre `/admin`

`/admin/login` y `/admin` son una demo visual del panel de administración
original. El login (`AuthContext.tsx`) acepta cualquier email/contraseña no
vacíos y guarda una sesión falsa en `sessionStorage` — no hay autenticación
real. Las secciones de CRUD funcionan sobre el estado en memoria descrito
arriba: se ven y se sienten funcionales durante la sesión, pero no persisten
nada. Como en el proyecto original, no hay ningún link visible a `/admin`
en la UI pública.
