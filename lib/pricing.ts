import { PackageItem } from '../types/shipping';

export function calculateChargeableWeight(item: PackageItem): number {
  const actualWeight = item.weight || 0;
  let volumeWeight = 0;

  if (item.size === 'Custom' && item.length && item.width && item.height) {
    volumeWeight = (item.length * item.width * item.height) / 5000;
  } else if (item.size === 'Small') {
    volumeWeight = (20 * 20 * 10) / 5000; // 0.8kg
  } else if (item.size === 'Medium') {
    volumeWeight = (40 * 30 * 25) / 5000; // 6kg
  } else if (item.size === 'Large') {
    volumeWeight = (50 * 40 * 30) / 5000; // 12kg
  }

  return Math.max(actualWeight, volumeWeight);
}

export function calculateTotalChargeableWeight(items: PackageItem[]): number {
  return items.reduce((total, item) => total + calculateChargeableWeight(item), 0);
}

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
