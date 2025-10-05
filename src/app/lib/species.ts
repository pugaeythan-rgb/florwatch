export type SpeciesId = 'salvia_officinalis' | 'leucophyllum_frutescens' | 'cosmos_bipinnatus';
export type Pheno = 'brotacion' | 'boton' | 'floracion' | 'fructificacion';

export const SPECIES = [
  { id: 'salvia_officinalis', label: 'Salvia officinalis' },
  { id: 'leucophyllum_frutescens', label: 'Leucophyllum frutescens' },
  { id: 'cosmos_bipinnatus', label: 'Cosmos bipinnatus' },
];

export const PHENO_PHASES = [
  { id: 'brotacion', label: 'Brotación' },
  { id: 'boton', label: 'Botón floral' },
  { id: 'floracion', label: 'Floración' },
  { id: 'fructificacion', label: 'Fructificación' },
];