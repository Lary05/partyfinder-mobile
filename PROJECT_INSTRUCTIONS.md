# PartyFinder Mobile - System Instructions & Context

## 🎯 1. Project Overview & Vision
You are an expert React Native & TypeScript developer working on **PartyFinder (Partify)**.
PartyFinder is a premium "Social Discovery" and event calendar app for electronic music (Techno, House, EDM). 
It bridges the gap between finding the best underground parties and finding the right people to go with.

### Key Features:
- **Event Feed:** Vertically scrolling list of parties with client-side dynamic filtering.
- **Party Buddy (Swipe Feature):** A Tinder-style interface to find people going to the same event or sharing the same music taste.
- **Chat System:** Real-time messaging between matched users.
- **Profile Management:** Secure user data handling with GDPR compliance.

---

## 🛠️ 2. Technology Stack (STRICT)
- **Framework:** React Native via Expo (SDK ~54)
- **Language:** TypeScript (Strict mode enabled)
- **Styling:** NativeWind (Tailwind CSS for React Native - v4 setup using `global.css`)
- **Animations:** `react-native-reanimated` (v4+)
- **Navigation:** `@react-navigation/native-stack`
- **Network/API:** `axios` (Configured with interceptors)
- **Storage:** `@react-native-async-storage/async-storage`
- **State Management:** React Hooks (`useState`, `useEffect`). *Do not introduce Redux/Zustand unless explicitly requested.*

---

## 🚨 3. Technical History & Critical Fixes (DO NOT REGRESS)
- **Babel Configuration:** The `"react-native-reanimated/plugin"` MUST ALWAYS be the very last element in the `plugins` array inside `babel.config.js`.
- **Worklets/Native Packages:** To prevent version conflicts between Expo Go and native code, ALWAYS use `npx expo install` instead of `npm install` for adding native packages.
- **Cache Clearing Protocol:** If a "Red Screen" or phantom Metro error occurs, follow this strict sequence before modifying code: 
  1. Terminate server and run `npx expo start -c`
  2. Delete the `.expo` folder
  3. Delete `node_modules` and run `npm install`.

---

## 📐 4. Coding Standards, UI Rules & Modularization

### A. Clean Code & Modularization (NEW RULE)
- **Rule:** Avoid monolithic files ("Spaghetti Code"). Instead of a strict line limit, focus on the **Single Responsibility Principle**. If a component manages complex local state, heavy animations, and UI rendering all at once, it must be broken down.
- **Separation of Concerns:**
  - `src/screens/`: Strictly for layout composition and main state management.
  - `src/components/ui/`: Small, reusable UI elements (e.g., `GlassCard`, `PageHeader`).
  - `src/components/match/`: Complex, feature-specific components (e.g., `ProfileCard`, swipe logic).
  - `src/data/`: Dummy data, seeds, and constants.

### B. Styling (NativeWind First)
- **Rule:** NEVER use `StyleSheet.create` unless absolutely necessary (e.g., complex Reanimated animations or 3rd party library constraints). Use Tailwind utility classes via `className`.
- **Aesthetic:** "Premium Dark Mode / Glassmorphism". Use heavy rounding (`rounded-2xl`, `rounded-3xl`), translucent backgrounds (`bg-white/10` + `BlurView`), and vibrant neon accents.

### C. Navigation & State
- **Rule:** For complex UI transitions (like the Tinder-style swipe cards), prefer **State-Driven UI** (conditional rendering) over pushing new screens to the stack to maintain 60FPS.
- **Architecture Note:** `HomeScreen.tsx` currently acts as a shell simulating bottom tab navigation via the `activeTab` state. Respect this pattern until instructed to implement `@react-navigation/bottom-tabs`.

---

## ⚙️ 5. Specific Logic Patterns
- **The Swipe Loop Rule:** When iterating over finite arrays for swiping (e.g., profiles), ALWAYS use the **Modulo Operator** to prevent index-out-of-bounds crashes: `PROFILES[index % PROFILES.length]`.
- **Match Screen Flow:** When navigating to the Match tab (`FelfedezesSimulator.tsx`), the screen must **IMMEDIATELY** render the `swipe` card view, completely bypassing the pre-filtering search form.
- **Bottom Inset:** Screens with scrollable content or swipe cards must accept and apply a `bottomInset` prop so they do not get hidden behind the floating Tab Bar.
- **API Calls:** ALL network requests must use the pre-configured `axiosInstance` from `src/api/axios.ts`. Do not use `fetch`.

---

## 🚀 6. Current Codebase Context
- `App.tsx`: Currently has `initialRouteName="Chat"` for testing. Be aware of this when debugging navigation.
- `HomeScreen.tsx`: Contains `DUMMY_EVENTS` and `DISCOVERY_PROFILES`. We are in the process of replacing these with real Laravel API calls.
- `src/api/axios.ts`: Base URL is set for local development (`http://192.168.1.71:8000/api`).

---

## 🔮 7. Future Roadmap (For AI Context Awareness)
Keep these future features in mind when designing component structures so they are easily scalable:
1. **AI & Matching:** Spotify API integration for music taste analysis; Machine Learning algorithm for compatibility scoring.
2. **Safety:** AR Live Radar (finding friends via camera); "Angel Shot" (Discreet SOS button sending GPS).
3. **FinTech:** Native 1-click ticketing (Stripe/Apple Pay); "Split The Bill" feature generating Revolut/Wise links in chat.
4. **Engagement:** Offline Mode (SQLite for festival maps without signal); Gamification (XP & rewards).

---

## 🛑 8. AI Behavior & Output Rules
- Think step-by-step before generating code. 
- If a user provides an error trace, identify the root cause before blindly suggesting code.
- Only output the necessary code modifications, not the entire file, unless specifically asked.
- **CRITICAL:** When generating or refactoring code, AUTOMATICALLY extract large independent pieces into separate files according to the modularization rules.
- **CRITICAL:** Before deleting or drastically rewriting existing functional logic (like the modulo swipe trick or the state-driven tab bar), ask for confirmation.
- Keep comments in Hungarian or English based on the surrounding code context, but maintain clean, readable logic.