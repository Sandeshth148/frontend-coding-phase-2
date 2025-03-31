# ⏳ Countdown Timer Widget (Angular Elements)

This project is a **lightweight, reusable countdown timer widget** built with **Angular 16** and exported as a **Web Component** using `@angular/elements`.

---

## 🎯 Purpose

To demonstrate a **framework-agnostic Angular widget** that:

- Fetches deadline seconds from a mock API
- Displays a live countdown updated every second
- Can be embedded in **any HTML page** — no Angular setup required

---

## 🧰 What’s Inside

| Area            | Choice / Details                                                                |
| --------------- | ------------------------------------------------------------------------------- |
| Angular Version | Angular 16 (latest stable)                                                      |
| Output Format   | Custom Element (`<countdown-timer-widget>`) using `@angular/elements`           |
| Mock API        | `DeadlineService` returning `{ secondsLeft: number }`                           |
| Countdown Logic | `RxJS interval`, `switchMap`, `takeWhile`                                       |
| Component Type  | Standard Angular component (no `standalone`) for compatibility with Elements    |
| AppModule       | Kept for bootstrapping and DI, but can be removed if converted to library build |
| Testing         | Includes working unit tests using `fakeAsync` and `tick()`                      |
| Styling         | Simple SCSS with flex-centered layout                                           |

---

## 🚀 Usage Instructions

### 🔧 Build the widget:

```bash
ng build --configuration production
🌐 Serve using http-server or similar:

cd dist/task1-angular-using-elements
npx http-server .
Now open http://localhost:8080 — your widget is live ✅
```

## 🧪 Embed in Any Page

### runtime*.js, polyfills*.js, main\*.js to your target app or HTML folder. Then use:

```
<countdown-timer-widget></countdown-timer-widget>

<script src="runtime.js"></script>
<script src="polyfills.js"></script>
<script src="main.js"></script>
✅ Works even in non-Angular apps!

```
