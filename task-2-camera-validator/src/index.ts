import { SoftwareCamera, Camera } from "./types";

/**
 * Validates whether the provided hardware cameras collectively cover
 * every (distance, light) pair required by the software camera range.
 *
 * Time Complexity: O(D × L × N)
 *   - D = number of distance units (softwareCam.distance.max - min + 1)
 *   - L = number of light units (softwareCam.light.max - min + 1)
 *   - N = number of hardware cameras
 *
 * Space Complexity: O(1) – no additional data structures used
 *
 * @param softwareCam Software camera requirement
 * @param hardwareCams Available hardware cameras
 * @returns true if every (distance, light) pair is covered by at least one camera
 */
export function willCamerasSuffice(
  softwareCam: SoftwareCamera,
  hardwareCams: Camera[]
): boolean {
  for (let d = softwareCam.distance.min; d <= softwareCam.distance.max; d++) {
    for (let l = softwareCam.light.min; l <= softwareCam.light.max; l++) {
      const isCovered = hardwareCams.some(
        (cam) =>
          d >= cam.distance.min &&
          d <= cam.distance.max &&
          l >= cam.light.min &&
          l <= cam.light.max
      );
      if (!isCovered) return false;
    }
  }
  return true;
}
