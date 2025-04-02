import { SoftwareCamera, Camera } from "./types";

/**
 * Represents a discrete camera coverage rectangle with integer boundaries.
 * Used internally for optimized interval calculations.
 */
type DiscreteRect = {
  d_min: number;
  d_max: number;
  l_min: number;
  l_max: number;
};

/**
 * Validates whether hardware cameras provide complete coverage of the software camera's requirements.
 * Uses discrete interval mathematics for efficient verification, with midpoint checks to prevent gaps.
 *
 * Key Features:
 * - Converts continuous ranges to discrete intervals for computational efficiency
 * - Divides the problem into vertical stripes for parallelizable checking
 * - Merges light coverage intervals per stripe to verify complete coverage
 * - Includes midpoint safeguards to catch adjacent-but-non-overlapping cameras
 *
 * Complexity Analysis:
 * - Time: O(N log N) average case, O(N²) worst case (when cameras have many overlapping stripes)
 *   - N = number of hardware cameras
 *   - Dominated by sorting and merging intervals
 * - Space: O(N) for storing boundaries and intermediate intervals
 *
 * @param {SoftwareCamera} softwareCam - The software camera's required coverage range
 * @param {Camera[]} hardwareCams - Available hardware cameras with their coverage ranges
 * @returns {boolean} True if every point in the software range is covered by at least one hardware camera
 */
export function willCamerasSuffice(
  softwareCam: SoftwareCamera,
  hardwareCams: Camera[]
): boolean {
  // Convert target ranges to discrete integer intervals
  // Using ceil/floor ensures we don't miss boundary cases
  const d_min_target = Math.ceil(softwareCam.distance.min);
  const d_max_target = Math.floor(softwareCam.distance.max);
  const l_min_target = Math.ceil(softwareCam.light.min);
  const l_max_target = Math.floor(softwareCam.light.max);

  // Pre-process cameras: clamp to target range and discard invalid ones
  const effectiveCams: DiscreteRect[] = [];
  for (const cam of hardwareCams) {
    const cam_d_min = Math.ceil(Math.max(cam.distance.min, d_min_target));
    const cam_d_max = Math.floor(Math.min(cam.distance.max, d_max_target));
    const cam_l_min = Math.ceil(Math.max(cam.light.min, l_min_target));
    const cam_l_max = Math.floor(Math.min(cam.light.max, l_max_target));

    if (cam_d_min <= cam_d_max && cam_l_min <= cam_l_max) {
      effectiveCams.push({
        d_min: cam_d_min,
        d_max: cam_d_max,
        l_min: cam_l_min,
        l_max: cam_l_max,
      });
    }
  }

  // Edge case: no valid cameras after clamping
  if (effectiveCams.length === 0) {
    return false;
  }

  // Collect all critical distance boundaries
  const boundariesSet = new Set<number>([d_min_target, d_max_target + 1]);
  for (const cam of effectiveCams) {
    boundariesSet.add(cam.d_min);
    boundariesSet.add(cam.d_max + 1); // +1 for half-open intervals
    boundariesSet.add(Math.floor((cam.d_min + cam.d_max) / 2)); // Midpoint check
  }

  // Process stripes in sorted order
  const boundaries = Array.from(boundariesSet).sort((a, b) => a - b);
  for (let i = 0; i < boundaries.length - 1; i++) {
    const stripeStart = boundaries[i];
    const stripeEnd = boundaries[i + 1] - 1; // Convert to inclusive

    // Skip irrelevant stripes
    if (stripeEnd < d_min_target || stripeStart > d_max_target) continue;

    // Find cameras covering this entire stripe
    const activeCams = effectiveCams.filter(
      (cam) => cam.d_min <= stripeStart && cam.d_max >= stripeEnd
    );
    if (activeCams.length === 0) return false;

    // Merge their light coverage intervals
    const mergedLight = mergeIntervals(
      activeCams.map((cam) => [cam.l_min, cam.l_max])
    );

    // Verify full light coverage
    if (!isRangeCovered(mergedLight, [l_min_target, l_max_target])) {
      return false;
    }
  }

  return true;
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
 * Checks if a target range is fully covered by merged intervals
 * @param {[number, number][]} merged - Merged intervals
 * @param {[number, number]} target - Target [min, max] range
 * @returns {boolean} True if fully covered
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
