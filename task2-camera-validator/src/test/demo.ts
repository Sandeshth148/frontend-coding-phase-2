import { willCamerasSuffice } from "../index";
import { SoftwareCamera, Camera } from "../types";

const softwareCam: SoftwareCamera = {
  distance: { min: 10, max: 20 },
  light: { min: 5, max: 15 },
};

const testCases = [
  {
    label: "TC1: One camera covers all",
    expected: true,
    cams: [{ distance: { min: 10, max: 20 }, light: { min: 5, max: 15 } }],
  },
  {
    label: "TC2: Two halves covering cleanly",
    expected: true,
    cams: [
      { distance: { min: 10, max: 15 }, light: { min: 5, max: 15 } },
      { distance: { min: 16, max: 20 }, light: { min: 5, max: 15 } },
    ],
  },
  {
    label: "TC3: Missing light 11",
    expected: false,
    cams: [
      { distance: { min: 10, max: 20 }, light: { min: 5, max: 10 } },
      { distance: { min: 10, max: 20 }, light: { min: 12, max: 15 } },
    ],
  },
  {
    label: "TC4: Missing distance 16",
    expected: false,
    cams: [
      { distance: { min: 10, max: 15 }, light: { min: 5, max: 15 } },
      { distance: { min: 17, max: 20 }, light: { min: 5, max: 15 } },
    ],
  },
  {
    label: "TC5: Looks okay, but missing (15,6)",
    expected: false,
    cams: [
      { distance: { min: 10, max: 12 }, light: { min: 5, max: 10 } },
      { distance: { min: 13, max: 15 }, light: { min: 11, max: 15 } },
      { distance: { min: 16, max: 18 }, light: { min: 5, max: 15 } },
      { distance: { min: 19, max: 20 }, light: { min: 5, max: 15 } },
      { distance: { min: 12, max: 14 }, light: { min: 5, max: 10 } },
      { distance: { min: 10, max: 20 }, light: { min: 11, max: 15 } },
    ],
  },
  {
    label: "TC6: Overlapping cameras",
    expected: true,
    cams: [
      { distance: { min: 10, max: 18 }, light: { min: 5, max: 15 } },
      { distance: { min: 15, max: 20 }, light: { min: 5, max: 15 } },
    ],
  },
  {
    label: "TC7: Minimal floating-point gap",
    expected: false,
    cams: [
      { distance: { min: 10, max: 15.999 }, light: { min: 5, max: 15 } },
      { distance: { min: 16.001, max: 20 }, light: { min: 5, max: 15 } },
    ],
  },
];

// Run tests
for (const test of testCases) {
  const result = willCamerasSuffice(softwareCam, test.cams);
  console.log(`${test.label} — Expected: ${test.expected}, Got: ${result}`);
}
