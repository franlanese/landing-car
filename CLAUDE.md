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
brand-neutral fork/template** derived from a real client landing page — the
backend, brand copy, and imagery were stripped out so it can be forked per
client. There is **no backend of any kind**: no Supabase, no Postgres, no
Storage, no RLS, no auth server. No state management library either.

### Content model

`src/data/` holds the static example data that used to live in Postgres:

- [content.ts](src/data/content.ts) — `courses`/`events`/`news` example
  items, keyed by `TableName` (see [src/types/content.ts](src/types/content.ts)
  for the shared `ContentItem` shape: `id`, `title`, `description`,
  `dateTime` (formatted `dd/mm/yyyy`), `eventDate` (ISO), `imageUrl`,
  `isFinished`). Built from raw `ContentRow`-shaped objects piped through
  `rowToItem` ([src/lib/contentMapping.ts](src/lib/contentMapping.ts)), the
  same pure mapping function the old Supabase-backed hooks used — it's
  still reused here for the snake_case→camelCase/date-formatting logic.
- [sponsors.ts](src/data/sponsors.ts), [socialLinks.ts](src/data/socialLinks.ts),
  [formSubmissions.ts](src/data/formSubmissions.ts) — example sponsors,
  social links, and admin "form submissions" respectively.

The hooks that used to call Supabase now read/mutate this data **in
memory**, keeping their original public signatures so every consumer
(`Home.tsx`, `ContentList`, `ContentDetail`, `AdminCrudSection`, etc.) works
unmodified:

- [useSupabaseTable(table)](src/hooks/useSupabaseTable.ts) — seeds a
  `useState` from `INITIAL_CONTENT[table]`; `create`/`update`/`remove`
  mutate that local array. Used by `Home.tsx` (read-only) and the admin CRUD
  UI (full read/write).
- [useSupabaseItem(table, id)](src/hooks/useSupabaseItem.ts) — looks up a
  single item by id in `INITIAL_CONTENT[table]`.
- [useSponsors()](src/hooks/useSponsors.ts), [useSocialLinks()](src/hooks/useSocialLinks.ts),
  [useFormSubmissions()](src/hooks/useFormSubmissions.ts) — same pattern
  over their respective `src/data/*` arrays.

**Important:** each hook call owns its own `useState`, seeded fresh from
`src/data/`. Two mounted instances of `useSupabaseTable('courses')` (e.g.
one in `Home.tsx`, one in the admin dashboard) do **not** share edits with
each other, and nothing survives a page refresh. This is intentional — the
goal is an admin UI that *feels* functional during a session, not a real
persistence layer. If a project forked from this template needs a real
backend, swap these hooks' internals for real fetch/mutate calls (a
Supabase project, a headless CMS, whatever) while keeping their return
shapes the same.

`InscriptionForm` and the contact form in `Home.tsx` no longer write
anywhere — their submit handlers just flip local `submitted` state and show
the same success UI the real forms used to show after a successful insert.

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
parameterized by table name and reused for Cursos/Eventos/Noticias inside
`AdminDashboard` — don't fork it per table, extend the generic component
instead unless one content type's fields genuinely diverge. Image "uploads"
in `AdminCrudSection` and `SponsorsAdmin` are plain text inputs for an image
URL (there's no Storage bucket to upload to) — point them at
`/images/placeholder/*.svg` or any external URL.

### Routing (src/App.tsx)

Public: `/`, `/historia`, `/cursos/:id`, `/eventos/:id`, `/noticias/:id`
(the last three render `ContentDetail` parameterized by table; courses/
events show `InscriptionForm`, news is read-only). Admin: `/admin/login`,
`/admin` (wrapped in `ProtectedRoute`).

Deployed on Vercel as a static build. [vercel.json](vercel.json) rewrites
every path to `index.html` — required because client-side routes 404 on
Vercel's static file server without it; if that file is ever removed,
direct navigation/refresh on any non-`/` route breaks in production even
though it works fine locally against the Vite dev server.

### Styling convention

One plain CSS file per component/page (no CSS modules, no Tailwind).
Global tokens (`--color-bg`, `--color-accent`, `--font-heading`, etc.) are
defined once in [src/index.css](src/index.css), imported globally via
`main.tsx` — this is also where the brand-neutral placeholder palette lives;
swap the variable **values** (not names) to re-skin a fork of this
template. **Gotcha:** everything else is scoped per component/page and only
loads when that component mounts — e.g. `.cta-button` lives in `Hero.css`
and only exists on pages that render `<Hero>`. Pages reachable by a direct
URL that bypasses `Home.tsx` (admin pages, `ContentDetail`,
`InscriptionForm`) must not assume another page's CSS is loaded; they define
their own self-contained classes instead (see `admin-shared.css` and
`InscriptionForm.css` for the pattern).

### Home page carousel

`Home.tsx` implements a custom infinite-loop carousel (`useInfiniteCarousel`,
defined inline in the file) shared by the Cursos/Eventos/Noticias sections —
clone-padded rendering with modulo-based index wrapping. It assumes a
non-empty items array; `Home.tsx` renders a loading/empty skeleton instead
of mounting the carousel markup rather than special-casing zero-length
input inside the hook (the example data in `src/data/` is never actually
empty, but the guard is kept for parity with the original and in case a
fork empties out `src/data/content.ts`).

### Placeholder images

Everything under [public/images/placeholder/](public/images/placeholder)
(`hero.svg`, `card.svg`, `logo.svg`, `sponsor.svg`, `story-1/2/3.svg`) is a
hand-made neutral gray SVG with a label, so the template renders correctly
offline with zero external image dependencies. Replace these files (or the
paths referencing them) with real assets when forking for a client.

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
