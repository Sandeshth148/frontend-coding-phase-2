# 🚀 Frontend Coding Phase 2

This repository contains the coding assignments for **Phase 2** of the frontend interview process at **6crickets**.

---

## ✅ Task 1 — Angular Countdown Timer

- ✅ Built with Angular 16 standalone component
- ✅ Uses RxJS to display a real-time countdown from API
- ✅ Unit-tested with mocked services
- ✅ Hosted online with GitHub Pages

🔗 **Live App:** [https://sandeshth148.github.io/frontend-coding-phase-2/](https://sandeshth148.github.io/frontend-coding-phase-2/)

📁 [Source Code](./task1-angular)  
📁 [Deployed Output](./docs) — used for GitHub Pages hosting

---

## ✨ Bonus — Task 1 with Angular Elements

A fully reusable **Web Component version** of the countdown timer, built with `@angular/elements`.

- ✅ Built as a **custom element**: `<countdown-timer-widget>`
- ✅ Can be embedded in any HTML/React/JS app
- ✅ Uses Angular DI and HttpClient
- ✅ Includes unit tests and mock API service
- 🧩 Could also be turned into an **Angular library** and published to **npm** for reuse across apps

📁 [Source Code](./task1-angular-using-elements)

---

## ✅ Task 2 — Hardware Camera Coverage Validator

- ✅ Implemented in TypeScript
- ✅ Validates 2D coverage of subject distance + light ranges
- ✅ Well-tested and structured for readability

📁 [Source Code](./task2-camera-validator)

---

## 📦 How to Run Locally

```bash
# For Task 1 (Angular app)
cd task1-angular
npm install
ng serve

# For Task 1 (Web Component version)
cd task1-angular-using-elements
npm install
ng build --configuration production
npx http-server ./dist/task1-angular-using-elements

# For Task 2 (Node/TS)
cd task2-camera-validator
npm install
npm test
```
