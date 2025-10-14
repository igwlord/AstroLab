/**
 * ⚠️ REVERTIDO: Barrel export causaba lentitud en desarrollo
 * 
 * PROBLEMA: Múltiples re-exports individuales desde lucide-react
 * causaban que Vite procesara cada ícono por separado, ralentizando HMR
 * 
 * SOLUCIÓN: Re-exportar TODO desde lucide-react en un solo statement
 * Vite/Rolldown ya hace tree-shaking automático en producción
 */

// Tree-shaking automático: Vite solo incluirá los íconos que realmente uses
export * from 'lucide-react';
