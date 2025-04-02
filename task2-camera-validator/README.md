# Task 2 — Hardware Camera Coverage Validator

This project contains a TypeScript solution that validates whether a set of hardware cameras can fully cover the range required by a software camera.

In this problem, the software camera must cover every (distance, light) pair in a defined rectangular area:

- **X-axis (Distance):** Represents the subject distance.
- **Y-axis (Light Level):** Represents the light intensity.

Each hardware camera supports a rectangular subrange in this 2D space. The goal is to verify that **every point** within the software camera’s range is covered by **at least one** hardware camera.

---

## Key Features

- **Discrete Interval Conversion:**  
  Continuous ranges are converted to discrete intervals using `Math.ceil` and `Math.floor`, ensuring robust coverage checks against floating-point imprecision.

- **Vertical Stripe-Based Checking:**  
  The solution divides the target distance range into vertical stripes—sub-intervals where the set of active cameras remains constant. This significantly reduces redundant checks.

- **Merged Light Coverage:**  
  Within each stripe, the light intervals of all cameras covering that stripe are merged to verify complete coverage of the target light range.

- **Midpoint Safeguards:**  
  Additional boundaries (using midpoints) are added to catch minimal gaps between adjacent cameras, addressing edge cases (e.g., TC2 and TC7).

---

## Complexity Analysis

| Step                        | Time Complexity       | Space Complexity |
| --------------------------- | --------------------- | ---------------- |
| Convert to discrete ranges  | O(N)                  | O(N)             |
| Collect and sort boundaries | O(N log N)            | O(N)             |
| Stripe iteration and checks | O(N × L)              | O(N)             |
| Light interval merging      | O(N log N) per stripe | O(N)             |

- **Overall Worst-Case:** O(N² log N)
- **Best-Case:** O(N log N)

---

## 📂 Project Structure

```
task2-camera-validator/
├── src/
│   ├── index.ts      # Core validation logic
│   └── types.ts      # Shared type interfaces
|   ├── test/demo.ts  # Standalone test cases
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Installation & Running Tests

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run test cases:**
   ```bash
   npm run test
   ```

---

## 🧠 Logic Overview

The function iterates through all `(distance, light)` pairs in the software camera's required rectangle and ensures that **at least one** hardware camera fully contains each pair.

## Final Notes

This solution is designed to be false safe—it only returns true if every discrete unit within the target range is covered by at least one hardware camera. For most practical scenarios, this robust discrete approach is sufficient. For applications demanding even finer precision, further adjustments (such as using smaller step sizes or additional floating-point checks) can be implemented.

---

## ✅ Sample Test Coverage

### Test Coverage

TC1: One camera covers all:
Full coverage detected by a single hardware camera.

TC2: Two halves cleanly:
Two cameras cover adjacent ranges; midpoint checks ensure no gap.

TC3: Missing light 11:
A gap in the light range is correctly identified.

TC4: Missing distance 16:
A gap in the distance range is correctly identified.

TC5: Missing (15,6):
A specific gap at (15,6) is detected.

TC6: Overlapping cameras:
Overlapping intervals are correctly merged.

TC7: Minimal floating-point gap:
Floating-point gaps are caught using midpoint safeguards.

---

## ✍️ Author

Developed by **Sandesh T H**  
April 2025 · Submitted as part of a coding challenge
