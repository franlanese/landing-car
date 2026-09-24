import type { Sponsor } from '../types/sponsor';

// Brands the dealership works with, shown in the "Marcas con las que
// trabajamos" grid on Home. Each logo lives at public/images/marcas/<id>.png
// (placeholders until replaced with the official logo, same file name).
const brand = (id: string, name: string): Sponsor => ({
  id,
  name,
  imageUrl: `/images/marcas/${id}.png`,
  url: null,
});

export const INITIAL_SPONSORS: Sponsor[] = [
  brand('toyota', 'Toyota'),
  brand('volkswagen', 'Volkswagen'),
  brand('ford', 'Ford'),
  brand('chevrolet', 'Chevrolet'),
  brand('fiat', 'Fiat'),
  brand('renault', 'Renault'),
  brand('peugeot', 'Peugeot'),
  brand('honda', 'Honda'),
];
