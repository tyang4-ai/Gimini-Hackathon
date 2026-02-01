/**
 * Statistics utilities for latency analysis
 */

export interface LatencyStats {
  count: number;
  successCount: number;
  failureCount: number;
  successRate: number;
  min: number;
  max: number;
  mean: number;
  median: number;
  p50: number;
  p75: number;
  p90: number;
  p95: number;
  p99: number;
  stdDev: number;
}

export function calculateStats(latencies: number[]): LatencyStats {
  if (latencies.length === 0) {
    return {
      count: 0,
      successCount: 0,
      failureCount: 0,
      successRate: 0,
      min: 0,
      max: 0,
      mean: 0,
      median: 0,
      p50: 0,
      p75: 0,
      p90: 0,
      p95: 0,
      p99: 0,
      stdDev: 0,
    };
  }

  const sorted = [...latencies].sort((a, b) => a - b);
  const n = sorted.length;

  const sum = sorted.reduce((a, b) => a + b, 0);
  const mean = sum / n;

  const squaredDiffs = sorted.map((x) => Math.pow(x - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / n;
  const stdDev = Math.sqrt(variance);

  const percentile = (p: number): number => {
    const index = Math.ceil((p / 100) * n) - 1;
    return sorted[Math.max(0, Math.min(index, n - 1))];
  };

  return {
    count: n,
    successCount: n,
    failureCount: 0,
    successRate: 100,
    min: sorted[0],
    max: sorted[n - 1],
    mean: Math.round(mean),
    median: percentile(50),
    p50: percentile(50),
    p75: percentile(75),
    p90: percentile(90),
    p95: percentile(95),
    p99: percentile(99),
    stdDev: Math.round(stdDev),
  };
}

export function formatMs(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

export function printStats(stats: LatencyStats, label: string): void {
  console.log(`\n📊 ${label} Statistics:`);
  console.log(`   Total calls: ${stats.count}`);
  console.log(
    `   Success rate: ${stats.successRate.toFixed(1)}% (${stats.successCount}/${stats.count})`
  );
  console.log(`   Min: ${formatMs(stats.min)}`);
  console.log(`   Max: ${formatMs(stats.max)}`);
  console.log(`   Mean: ${formatMs(stats.mean)}`);
  console.log(`   Median (p50): ${formatMs(stats.p50)}`);
  console.log(`   p75: ${formatMs(stats.p75)}`);
  console.log(`   p90: ${formatMs(stats.p90)}`);
  console.log(`   p95: ${formatMs(stats.p95)}`);
  console.log(`   p99: ${formatMs(stats.p99)}`);
  console.log(`   Std Dev: ${formatMs(stats.stdDev)}`);
}
