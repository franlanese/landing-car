import React from 'react';
import type { TableName } from '../../types/content';

const PATHS: Record<TableName, React.ReactNode> = {
  usados: (
    <>
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </>
  ),
  motos: (
    <>
      <circle cx="5" cy="16" r="3" />
      <circle cx="19" cy="16" r="3" />
      <path d="M19 16 15.2 6.5" />
      <path d="M13.2 6.5h3.6" />
      <path d="M5 16 8 10.5h8.5" />
      <path d="M9.5 10.5 11 16h3.5l2-5.5" />
    </>
  ),
  utilitarios: (
    <>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </>
  ),
};

interface CategoryIconProps {
  table: TableName;
  size?: number;
}

/** Stroke icon for a vehicle category (auto / moto / utilitario). Inherits `currentColor`. */
export const CategoryIcon: React.FC<CategoryIconProps> = ({ table, size = 24 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {PATHS[table]}
  </svg>
);
