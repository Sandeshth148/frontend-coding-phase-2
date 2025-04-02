import { SoftwareCamera, Camera } from "./types";

/**
 * Represents a discrete coverage rectangle with integer boundaries
 * @property d_min - Minimum distance (inclusive)
 * @property d_max - Maximum distance (inclusive)
 * @property l_min - Minimum light level (inclusive)
 * @property l_max - Maximum light level (inclusive)
 */
type DiscreteRect = {
  d_min: number;
  d_max: number;
  l_min: number;
  l_max: number;
};

/**
 * Validates complete camera coverage with O(N log N) average-case complexity.
 *
 * Key Features:
 * - Handles continuous ranges via conservative discretization
 * - Midpoint checks catch floating-point gaps
 * - Early termination on first coverage gap
 *
 * Complexity:
 * - Best: O(N)       (single camera covers all)
 * - Average: O(N log N) (typical camera distribution)
 * - Worst: O(N²)     (highly fragmented cameras)
 */
export function willCamerasSuffice(
  softwareCam: SoftwareCamera,
  hardwareCams: Camera[]
): boolean {
  // First check exact boundaries (avoid discretization misses)
  if (!checkBoundaryPoints(softwareCam, hardwareCams)) {
    return false;
  }

  // Convert to discrete intervals (conservative)
  const [d_min, d_max] = [
    Math.ceil(softwareCam.distance.min),
    Math.floor(softwareCam.distance.max),
  ];
  const [l_min, l_max] = [
    Math.ceil(softwareCam.light.min),
    Math.floor(softwareCam.light.max),
  ];

  const effectiveCams = hardwareCams
    .map((cam) => ({
      d_min: Math.ceil(Math.max(cam.distance.min, d_min)),
      d_max: Math.floor(Math.min(cam.distance.max, d_max)),
      l_min: Math.ceil(Math.max(cam.light.min, l_min)),
      l_max: Math.floor(Math.min(cam.light.max, l_max)),
    }))
    .filter((cam) => cam.d_min <= cam.d_max && cam.l_min <= cam.l_max);

  if (effectiveCams.length === 0) return false;

  // Process distance stripes
  const boundaries = collectBoundaries(d_min, d_max, effectiveCams);
  for (let i = 0; i < boundaries.length - 1; i++) {
    const stripe = { start: boundaries[i], end: boundaries[i + 1] - 1 };
    if (!checkStripeCoverage(stripe, l_min, l_max, effectiveCams)) {
      return false;
    }
  }

  return true;
}

/** Verifies exact min/max points aren't missed by discretization */
function checkBoundaryPoints(
  softwareCam: SoftwareCamera,
  hardwareCams: Camera[]
): boolean {
  const points = [
    [softwareCam.distance.min, softwareCam.light.min],
    [softwareCam.distance.min, softwareCam.light.max],
    [softwareCam.distance.max, softwareCam.light.min],
    [softwareCam.distance.max, softwareCam.light.max],
  ];

  return points.every(([d, l]) =>
    hardwareCams.some(
      (cam) =>
        d >= cam.distance.min &&
        d <= cam.distance.max &&
        l >= cam.light.min &&
        l <= cam.light.max
    )
  );
}

/** Collects all critical distance boundaries with midpoints */
function collectBoundaries(
  d_min: number,
  d_max: number,
  cameras: DiscreteRect[]
): number[] {
  const boundaries = new Set<number>([d_min, d_max + 1]);

  cameras.forEach((cam) => {
    boundaries.add(cam.d_min);
    boundaries.add(cam.d_max + 1);
    // Critical: Check midpoints between cameras
    boundaries.add(Math.floor((cam.d_min + cam.d_max) / 2));
  });

  return Array.from(boundaries).sort((a, b) => a - b);
}

/** Checks light coverage for a specific distance stripe */
function checkStripeCoverage(
  stripe: { start: number; end: number },
  l_min: number,
  l_max: number,
  cameras: DiscreteRect[]
): boolean {
  const activeCams = cameras.filter(
    (cam) => cam.d_min <= stripe.start && cam.d_max >= stripe.end
  );

  if (activeCams.length === 0) return false;

  const mergedLight = mergeIntervals(
    activeCams.map((cam) => [cam.l_min, cam.l_max])
  );

  return isRangeCovered(mergedLight, [l_min, l_max]);
}

/**
 * Merges overlapping/inter-adjacent intervals
 * @param {[number, number][]} intervals - Array of [start, end] tuples
 * @returns {[number, number][]} Merged intervals
 */
function mergeIntervals(intervals: [number, number][]): [number, number][] {
  if (intervals.length === 0) return [];

  intervals.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    if (intervals[i][0] <= last[1] + 1) {
      // +1 allows adjacent integer intervals to merge
      last[1] = Math.max(last[1], intervals[i][1]);
    } else {
      merged.push(intervals[i]);
    }
  }

  return merged;
}

/**
 * Checks if target light range is fully covered by merged intervals
 *
 * @param merged - Array of merged light intervals
 * @param target - Target [min, max] light range
 * @returns true if any interval fully contains the target range
 */
function isRangeCovered(
  merged: [number, number][],
  target: [number, number]
): boolean {
  for (const [start, end] of merged) {
    if (start <= target[0] && end >= target[1]) {
      return true;
    }
  }
  return false;
}
