import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utilidad para combinar clases de Tailwind CSS
 * Combina clsx y tailwind-merge para un manejo óptimo de clases condicionales
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}