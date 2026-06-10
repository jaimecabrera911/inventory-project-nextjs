export interface Product {
  id?: number;
  rollo: string;
  calibre: string;
  ral: string;
  color: string;
  pesoKg: number;
  importador: string;
  observaciones: string;
  fechaIngreso: Date | null | string;
  estado: string;
}
