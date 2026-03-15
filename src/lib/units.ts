export type LengthUnit = 'mm' | 'cm' | 'm' | 'in' | 'ft';

const toMmFactors: Record<LengthUnit, number> = {
  mm: 1,
  cm: 10,
  m: 1000,
  in: 25.4,
  ft: 304.8,
};

export const lengthUnits: LengthUnit[] = ['mm', 'cm', 'm', 'in', 'ft'];

export function convertToMm(value: number, unit: LengthUnit): number {
  return value * toMmFactors[unit];
}

export function convertFromMm(value: number, unit: LengthUnit): number {
  return value / toMmFactors[unit];
}
