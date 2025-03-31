# Task 2 — Hardware Camera Coverage Validator

This project contains a TypeScript solution to validate whether a set of hardware cameras can fully cover a software camera's required range of distances and light levels.

The problem simulates a 2D space where:

- **X-axis** = subject distance
- **Y-axis** = light level

Each hardware camera supports a rectangular subrange. The software camera must ensure that **every (distance, light)** pair within its required range is covered by **at least one** hardware camera.

---

## 📂 Project Structure

```
task2-camera-validator/
├── src/
│   ├── index.ts      # Core validation logic
│   └── types.ts      # Shared type interfaces
├── test.ts           # Standalone test cases
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

### Time & Space Complexity

- **Time Complexity:** `O(D × L × N)`  
  Where:

  - `D` = range of distances (softwareCam.distance.max - min + 1)
  - `L` = range of light levels (softwareCam.light.max - min + 1)
  - `N` = number of hardware cameras

- **Space Complexity:** `O(1)` (no additional data structures used)

---

## ✅ Sample Test Coverage

- Full rectangle covered by a single camera
- Splitting rectangle coverage across multiple hardware cameras
- Cases with gaps in either distance or light level
- Near-complete coverage with one uncovered (distance, light) pair

All test cases are included in `test.ts`.

---

## ✍️ Author

Developed by **Sandesh T H**  
March 2025 · Submitted as part of a coding challenge
