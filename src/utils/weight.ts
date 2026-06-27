import type { AppSettings } from "../types/Settings";

const KG_TO_LB = 2.2046226218;

export function parseWeightKg(value: number | string): number | null {
  const normalized = String(value).trim().replace(",", ".");
  const parsed = parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function convertInputToStoredKg(
  value: number | string,
  inputUnit: AppSettings["weightUnit"]
): number | string {
  const parsed = parseWeightKg(value);
  if (parsed === null) return value;
  if (inputUnit === "lb") {
    return Number((parsed / KG_TO_LB).toFixed(2));
  }
  return parsed;
}

export function formatWeight(
  value: number | string,
  unit: AppSettings["weightUnit"]
): string {
  const kg = parseWeightKg(value);
  if (kg === null) return String(value);

  if (unit === "kg") {
    return `${formatNumber(kg)} kg`;
  }

  return `${formatNumber(kg * KG_TO_LB)} lb`;
}

export function weightInputLabel(unit: AppSettings["weightUnit"]): string {
  return unit === "kg" ? "kg" : "lb";
}
