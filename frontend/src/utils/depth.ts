import type { DepthTier } from '@/types';

const DEPTH_ORDER: DepthTier[] = ['I', 'II', 'III', 'IV', 'V+'];

/**
 * Compare two depth tiers.
 * Returns negative if a < b, positive if a > b, 0 if equal.
 */
export function compareDepths(a: DepthTier, b: DepthTier): number {
  return DEPTH_ORDER.indexOf(a) - DEPTH_ORDER.indexOf(b);
}

/**
 * Get the next depth tier.
 * V+ is the maximum and returns itself.
 */
export function nextDepth(current: DepthTier): DepthTier {
  const index = DEPTH_ORDER.indexOf(current);
  return index < DEPTH_ORDER.length - 1 ? DEPTH_ORDER[index + 1] : 'V+';
}

/**
 * Get numeric value for depth tier.
 */
export function depthToNumber(depth: DepthTier): number {
  return DEPTH_ORDER.indexOf(depth) + 1;
}

/**
 * Get depth tier from numeric value.
 */
export function numberToDepth(num: number): DepthTier {
  return DEPTH_ORDER[Math.min(num - 1, DEPTH_ORDER.length - 1)] || 'I';
}

/**
 * Get display name for depth tier.
 */
export function getDepthName(depth: DepthTier): string {
  const names: Record<DepthTier, string> = {
    'I': 'The Primordial Silence',
    'II': 'The Becoming',
    'III': 'The Flourishing',
    'IV': 'The Reckoning',
    'V+': 'The Infinite',
  };
  return names[depth];
}

/**
 * Get depth color CSS variable name.
 */
export function getDepthColor(depth: DepthTier): string {
  return `var(--depth-${depth === 'V+' ? 'V' : depth})`;
}
