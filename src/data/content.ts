import { rowToItem, type ContentRow } from '../lib/contentMapping';
import type { ContentItem, TableName } from '../types/content';

// Static example stock for the dealership mockup. Shape matches what
// `rowToItem` (src/lib/contentMapping.ts) produces from a DB-style row, so the
// mapping stays reusable if a fork plugs in a real backend.

// Each unit's photo lives at public/images/stock/<categoria>/<id>.jpg
// (placeholders until replaced with the real photo, same file name).
const photo = (table: TableName, id: string) => `/images/stock/${table}/${id}.jpg`;

const usadosRows: ContentRow[] = [
  {
    id: 'toyota-corolla-2021',
    title: 'Toyota Corolla 2.0 XEI CVT',
    description:
      'Única dueña, todos los services oficiales en concesionario. Cubiertas nuevas, llave de repuesto y manuales. Lista para transferir.',
    published_at: '2026-08-02',
    image_url: photo('usados', 'toyota-corolla-2021'),
    is_sold: false,
    year: 2021,
    km: 48000,
    price_usd: 22900,
  },
  {
    id: 'vw-tcross-2022',
    title: 'Volkswagen T-Cross Highline 1.4 TSI',
    description:
      'Impecable, sin detalles de chapa ni pintura. Pantalla multimedia con Apple CarPlay y Android Auto, cámara de retroceso y sensores.',
    published_at: '2026-08-10',
    image_url: photo('usados', 'vw-tcross-2022'),
    is_sold: false,
    year: 2022,
    km: 28500,
    price_usd: 25500,
  },
  {
    id: 'chevrolet-cruze-2020',
    title: 'Chevrolet Cruze LTZ 1.4T AT',
    description:
      'Tope de gama con techo solar, tapizados de cuero y asistente de estacionamiento. Services al día.',
    published_at: '2026-08-18',
    image_url: photo('usados', 'chevrolet-cruze-2020'),
    is_sold: true,
    year: 2020,
    km: 70000,
    price_usd: 18900,
  },
  {
    id: 'jeep-compass-2020',
    title: 'Jeep Compass Longitude 2.4 AT',
    description:
      '4x2 automática, tapizado de cuero, climatizador bizona y control de crucero. Service de los 50.000 km recién hecho.',
    published_at: '2026-08-27',
    image_url: photo('usados', 'jeep-compass-2020'),
    is_sold: false,
    year: 2020,
    km: 55000,
    price_usd: 24800,
  },
  {
    id: 'peugeot-208-2022',
    title: 'Peugeot 208 Feline 1.6',
    description:
      'Techo panorámico, i-Cockpit con pantalla táctil y llantas de aleación. Ideal primer auto, muy económico en consumo.',
    published_at: '2026-09-05',
    image_url: photo('usados', 'peugeot-208-2022'),
    is_sold: false,
    year: 2022,
    km: 31000,
    price_usd: 17200,
  },
  {
    id: 'ford-territory-2023',
    title: 'Ford Territory Titanium 1.8T',
    description:
      'Como nueva, con garantía de fábrica vigente. Pantalla de 12", cargador inalámbrico, cámara 360° y asistentes de manejo.',
    published_at: '2026-09-15',
    image_url: photo('usados', 'ford-territory-2023'),
    is_sold: false,
    year: 2023,
    km: 22000,
    price_usd: 31500,
  },
];

const motosRows: ContentRow[] = [
  {
    id: 'honda-twister-2022',
    title: 'Honda CB 250 Twister',
    description:
      'Service al día, cubiertas en muy buen estado y papeles listos para transferir. Ideal para ciudad y ruta.',
    published_at: '2026-07-28',
    image_url: photo('motos', 'honda-twister-2022'),
    is_sold: false,
    year: 2022,
    km: 8500,
    price_usd: 4200,
  },
  {
    id: 'yamaha-fz-2021',
    title: 'Yamaha FZ-S 2.0',
    description:
      'Inyección electrónica, freno a disco delantero y tablero digital. Muy económica, perfecta para el día a día.',
    published_at: '2026-08-06',
    image_url: photo('motos', 'yamaha-fz-2021'),
    is_sold: false,
    year: 2021,
    km: 12300,
    price_usd: 3600,
  },
  {
    id: 'honda-xr150-2023',
    title: 'Honda XR 150L',
    description:
      'Poco uso, siempre guardada bajo techo. Ideal para tierra y ciudad, con cubiertas mixtas nuevas.',
    published_at: '2026-08-20',
    image_url: photo('motos', 'honda-xr150-2023'),
    is_sold: false,
    year: 2023,
    km: 4100,
    price_usd: 2900,
  },
  {
    id: 'yamaha-mt03-2021',
    title: 'Yamaha MT-03',
    description:
      'Bicilíndrica de 321 cc con ABS. Escape original, cubrecárter y sliders. Un solo dueño.',
    published_at: '2026-08-30',
    image_url: photo('motos', 'yamaha-mt03-2021'),
    is_sold: false,
    year: 2021,
    km: 9800,
    price_usd: 6900,
  },
  {
    id: 'bajaj-ns200-2022',
    title: 'Bajaj Rouser NS 200',
    description:
      '200 cc refrigerada por líquido, freno a disco en ambas ruedas. Muy cuidada, con baúl trasero incluido.',
    published_at: '2026-09-08',
    image_url: photo('motos', 'bajaj-ns200-2022'),
    is_sold: false,
    year: 2022,
    km: 11000,
    price_usd: 3400,
  },
  {
    id: 'kawasaki-z400-2020',
    title: 'Kawasaki Z400',
    description:
      'Bicilíndrica de 399 cc con ABS y embrague antirrebote. Mantenimiento en concesionario oficial.',
    published_at: '2026-09-18',
    image_url: photo('motos', 'kawasaki-z400-2020'),
    is_sold: false,
    year: 2020,
    km: 15600,
    price_usd: 7500,
  },
];

const utilitariosRows: ContentRow[] = [
  {
    id: 'renault-kangoo-2022',
    title: 'Renault Kangoo II Express 1.6',
    description:
      'Furgón con puerta lateral corrediza y separador de carga. Ideal para reparto urbano, services al día.',
    published_at: '2026-07-30',
    image_url: photo('utilitarios', 'renault-kangoo-2022'),
    is_sold: false,
    year: 2022,
    km: 42000,
    price_usd: 16900,
  },
  {
    id: 'ford-ranger-2020',
    title: 'Ford Ranger XLT 3.2 4x4 AT',
    description:
      'Cabina doble 4x4 automática, cubrecaja, enganche y barras. Service oficial de los 90.000 km realizado.',
    published_at: '2026-08-12',
    image_url: photo('utilitarios', 'ford-ranger-2020'),
    is_sold: false,
    year: 2020,
    km: 95000,
    price_usd: 32000,
  },
  {
    id: 'peugeot-partner-2020',
    title: 'Peugeot Partner Confort 1.6 HDi',
    description:
      'Furgón diésel muy económico, con aire acondicionado y dirección asistida. Listo para trabajar.',
    published_at: '2026-08-24',
    image_url: photo('utilitarios', 'peugeot-partner-2020'),
    is_sold: false,
    year: 2020,
    km: 88000,
    price_usd: 13500,
  },
  {
    id: 'toyota-hilux-2021',
    title: 'Toyota Hilux SRV 2.8 4x4 AT',
    description:
      'Cabina doble 4x4 automática, tapizados de cuero y pantalla multimedia. Un solo dueño, services oficiales.',
    published_at: '2026-09-01',
    image_url: photo('utilitarios', 'toyota-hilux-2021'),
    is_sold: false,
    year: 2021,
    km: 78000,
    price_usd: 38500,
  },
  {
    id: 'fiat-fiorino-2023',
    title: 'Fiat Fiorino Endurance 1.4',
    description:
      'Utilitario compacto ideal para comercio. Poco uso, con protector de carga y aire acondicionado.',
    published_at: '2026-09-10',
    image_url: photo('utilitarios', 'fiat-fiorino-2023'),
    is_sold: false,
    year: 2023,
    km: 26000,
    price_usd: 12800,
  },
  {
    id: 'vw-amarok-2021',
    title: 'Volkswagen Amarok V6 Highline',
    description:
      'Cabina doble V6 de 258 CV con tracción integral permanente. Lona marítima, cuero y llantas de 20".',
    published_at: '2026-09-19',
    image_url: photo('utilitarios', 'vw-amarok-2021'),
    is_sold: false,
    year: 2021,
    km: 60000,
    price_usd: 45000,
  },
];

export const INITIAL_CONTENT: Record<TableName, ContentItem[]> = {
  usados: usadosRows.map(rowToItem),
  motos: motosRows.map(rowToItem),
  utilitarios: utilitariosRows.map(rowToItem),
};
