# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start Vite dev server
npm run build     # tsc -b (typecheck, no emit) && vite build
npm run lint      # eslint .
npm run preview   # serve the production build locally
```

There is no test suite/runner configured in this project.

## Architecture

React 19 + TypeScript + Vite SPA (`react-router-dom` v7). **This is a
mockup ("maqueta") of a used-vehicle dealership site** (autos, motos y
utilitarios usados), built on top of a brand-neutral landing template that
was itself derived from a real client page with the backend, brand copy and
imagery stripped out. The dealership is a placeholder too ("Tu
Concesionaria"), so it can be forked per dealer. There is **no backend of
any kind**: no Supabase, no Postgres, no Storage, no RLS, no auth server. No
state management library either.

### Content model

`src/data/` holds the static example data that used to live in Postgres:

- [content.ts](src/data/content.ts) — the example stock, keyed by
  `TableName`: `usados` (shown as "Usados destacados"), `motos` and
  `utilitarios`. [src/types/content.ts](src/types/content.ts) has the shared
  `ContentItem` (a vehicle listing: `id`, `title`, `description`,
  `publishedAt` (ISO), `imageUrl`, `isSold`, `year`, `km`, `price` in USD)
  plus `TABLE_NAMES` (category order used everywhere), `TABLE_LABELS` and
  `TABLE_ITEM_LABELS`. Built from snake_case `ContentRow` objects piped
  through `rowToItem` ([src/lib/contentMapping.ts](src/lib/contentMapping.ts)),
  which also holds the display formatters (`formatDateEs`, `formatKm`,
  `formatPrice` → `US$ 22.900`).
- [sponsors.ts](src/data/sponsors.ts) — the car brands shown in "Marcas con
  las que trabajamos" (the data/hook/admin keep the old "sponsor" naming).
  [socialLinks.ts](src/data/socialLinks.ts),
  [formSubmissions.ts](src/data/formSubmissions.ts) — example social links
  and admin "Consultas" (form submissions).

The hooks that used to call Supabase now read/mutate this data **in
memory**, keeping their original public signatures so every consumer
(`Home.tsx`, `Catalogo`, `ContentDetail`, `AdminCrudSection`, etc.) works
the same way it did against the real backend:

- [useSupabaseTable(table)](src/hooks/useSupabaseTable.ts) — seeds a
  `useState` from `INITIAL_CONTENT[table]`; `create`/`update`/`remove`
  mutate that local array. Used by `Home.tsx`, `Catalogo` and
  `ContentDetail` (read-only) and the admin CRUD UI (full read/write). It
  only reads `table` on mount, which is why `App.tsx` keys each
  `ContentDetail` route by table.
- [useSupabaseItem(table, id)](src/hooks/useSupabaseItem.ts) — looks up a
  single item by id in `INITIAL_CONTENT[table]`.
- [useSponsors()](src/hooks/useSponsors.ts), [useSocialLinks()](src/hooks/useSocialLinks.ts),
  [useFormSubmissions()](src/hooks/useFormSubmissions.ts) — same pattern
  over their respective `src/data/*` arrays.

**Important:** each hook call owns its own `useState`, seeded fresh from
`src/data/`. Two mounted instances of `useSupabaseTable('usados')` (e.g.
one in `Home.tsx`, one in the admin dashboard) do **not** share edits with
each other, and nothing survives a page refresh. This is intentional — the
goal is an admin UI that *feels* functional during a session, not a real
persistence layer. If a project forked from this template needs a real
backend, swap these hooks' internals for real fetch/mutate calls (a
Supabase project, a headless CMS, whatever) while keeping their return
shapes the same.

`InquiryForm` ("Consultar por esta unidad", on `ContentDetail`) and the
contact form in `Home.tsx` don't write anywhere — their submit handlers
just flip local `submitted` state and show the success UI a real insert
would.

### Auth & admin panel

Single-admin auth is **mocked**: `AuthContext`
([src/context/AuthContext.tsx](src/context/AuthContext.tsx)) accepts any
non-empty email/password in `signIn` and stores a fake session
(`{ user: { email } }`) in `sessionStorage` under the `template-auth` key —
no real authentication happens. `ProtectedRoute`
([src/components/ProtectedRoute/ProtectedRoute.tsx](src/components/ProtectedRoute/ProtectedRoute.tsx))
still redirects to `/admin/login` when there's no session, same as before.
There is intentionally **no visible admin link anywhere in the public UI**
— `/admin/login` is reached only by direct URL.

The admin CRUD UI is one generic component,
[AdminCrudSection](src/components/AdminCrudSection/AdminCrudSection.tsx),
parameterized by table name and reused for Usados/Motos/Utilitarios inside
`AdminDashboard` — don't fork it per table, extend the generic component
instead unless one category's fields genuinely diverge. It edits the
vehicle fields (año, km, precio) and toggles `isSold` ("Marcar vendido" /
"Volver a publicar"). Image "uploads" in `AdminCrudSection` and
`SponsorsAdmin` (tab "Marcas") are plain text inputs for an image URL
(there's no Storage bucket to upload to) — point them at a file under
`public/images/stock/` or `public/images/marcas/`, or any external URL.

### Routing (src/App.tsx)

Public: `/`, `/historia`, `/stock` ([Catalogo](src/pages/Catalogo/Catalogo.tsx):
every unit from every category, filterable with `?tipo=usados|motos|utilitarios`
and sortable with `?orden=precio-asc|precio-desc|km-asc`, sold units always
last), and `/usados/:id`, `/motos/:id`, `/utilitarios/:id` (all render
`ContentDetail` parameterized by table: specs, inquiry form — or a "vendida"
notice when `isSold` — and a carousel of other units of the same category).
Bare `/usados`, `/motos`, `/utilitarios` redirect to the filtered `/stock`.
Admin: `/admin/login`, `/admin` (wrapped in `ProtectedRoute`).

Deployed on Vercel as a static build. [vercel.json](vercel.json) rewrites
every path to `index.html` — required because client-side routes 404 on
Vercel's static file server without it; if that file is ever removed,
direct navigation/refresh on any non-`/` route breaks in production even
though it works fine locally against the Vite dev server.

### Styling convention

One plain CSS file per component/page (no CSS modules, no Tailwind).
Global tokens (`--color-bg`, `--color-accent`, `--font-heading`, etc.) are
defined once in [src/index.css](src/index.css), imported globally via
`main.tsx` — this is also where the palette lives (light theme: white
cards on a light gray page, navy text, blue `--color-accent`, orange
`--color-highlight` for the main sales CTAs); swap the variable **values**
(not names) to re-skin a fork. Colors used translucent have an `-rgb`
triplet token next to them (`--color-accent-rgb`, `--color-dark-rgb`, …)
and component stylesheets write `rgba(var(--color-accent-rgb), 0.15)`
instead of hardcoded rgba values — keep it that way so a re-skin reaches
every border/shadow/tint. Headings use `--color-heading`, borders
`--color-border`, card shadows `--shadow-sm/md/lg`.

Dark bands (home hero over the cover photo, the `<Hero>` "Tomamos tu usado"
banner, the "ver todo el stock" band, Historia slides, both footers) carry
the `.theme-dark` utility class from `index.css`: it re-points the text
tokens (`--color-heading`, `--color-text`, `--color-accent`, …) to
light-on-dark values for everything inside, so components keep using the
same tokens instead of hardcoding white. The element still sets its own
dark background (`--color-dark` or `--gradient-brand`). Global helpers also
in `index.css`: `.cta-button` (outline pill) + `.cta-button--highlight`
(solid orange), and `.ambient-bg`, the faint grid layer behind sections.

**Gotcha:** everything else is scoped per component/page and only
loads when that component mounts — e.g. `.section-title` lives in
`Home.css`, which is why `Catalogo` and `ContentDetail` import it. Pages reachable by a direct
URL that bypasses `Home.tsx` (admin pages, `ContentDetail`,
`InquiryForm`) must not assume another page's CSS is loaded; they define
their own self-contained classes instead (see `admin-shared.css` and
`InquiryForm.css` for the pattern). The vehicle card and carousel styles
live with their components (`VehicleCard.css`, `VehicleCarousel.css` — the
latter also owns the generic `.slideshow-*` classes that Home's mobile
"Nosotros" slideshow reuses).

### Home page & carousels

`Home.tsx` renders, in order: hero, "¿Por qué elegirnos?" (`#nosotros`),
the `<Hero>` "Tomamos tu usado" banner, one `VehicleSection` per category
(`#usados`, `#motos`, `#utilitarios` — the 4 most recently published units
each), the "ver todo el stock" call-to-action (`#stock`, links to `/stock`
with per-category counts), the brands grid, and contact.

Vehicle carousels are [VehicleCarousel](src/components/VehicleCarousel/VehicleCarousel.tsx)
(arrows, dots, pointer-drag, optional autoplay) rendering
[VehicleCard](src/components/VehicleCard/VehicleCard.tsx), on top of the
clone-padded infinite loop in
[useInfiniteCarousel](src/hooks/useInfiniteCarousel.ts) (also used directly
by the brands grid). The carousel expects a non-empty `items` array —
callers render a loading/empty placeholder instead of mounting it (the
example data is never empty, but the guard is kept in case a fork empties
`src/data/content.ts`).

### Images (placeholders meant to be replaced in place)

Every image under `public/images/` except `Iconos50x50/` and `Zonodev/` is a
gray placeholder that says which file it is. The intended workflow is to
**overwrite each file with the real one under the same name**, with no code
changes:

- `stock/<categoria>/<id>.jpg` — one photo per unit; the file name is the
  unit `id` from `src/data/content.ts` (built by its `photo(table, id)`
  helper). Adding a unit means adding its row there plus its photo here.
- `marcas/<id>.png` — brand logos for the "Marcas" grid (ids from
  `src/data/sponsors.ts`). Tiles fit any aspect ratio (`object-fit: contain`),
  so transparent PNG logos work as-is.
- `sitio/` — `portada.jpg` (home hero background, under a dark overlay),
  `logo.png` (home hero + footer), `tomamos-tu-usado.jpg` (portrait image in
  `<Hero>`), `historia-1/2/3.jpg` (Historia slides, used both as the
  full-screen background and as side images).

If a real file uses a different extension (e.g. `.webp`), update the path
in code too. The favicon (`public/favicon.svg`) is a simple car icon in the
brand blue.

### Environment variables

None. `.env.example` is intentionally empty — this template ships with no
external services configured. If a fork adds a backend, restore the
`VITE_*` pattern here and in `src/vite-env.d.ts`.

### ESLint

Uses `eslint-plugin-react-hooks` v7 (React Compiler rules), which is
stricter than most React projects — notably `react-hooks/set-state-in-effect`
flags the common "fetch in `useEffect`, `setState` on resolve" pattern.
`AuthContext.tsx`'s one-time `sessionStorage` read still has a scoped
`eslint-disable-next-line` with a comment explaining why it's safe; follow
that pattern rather than disabling the rule globally.
