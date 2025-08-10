## OFX Frontend Coding Test

### Overview
A currency conversion UI that fetches live rates and shows users both the true amount and the amount after OFX markup. Implements smooth progress indication and robust data fetching with debounce, timeout/retry, and race-condition safety.

### What’s implemented (mapped to questions)
- **Q1 – Close dropdowns on outside click**: Both dropdowns close when clicking outside. Only one dropdown can be open at a time.
- **Q2 – New input component**: Added a controlled `Input` component with validation and debouncing; parent is notified only when debouncing state/value actually change.
- **Q3 – Conversion + 0.5% markup**:
  - Displays both the true amount and the amount after markup.
  - Markup is 0.5% (0.005). Utilities handle rounding/edge cases.
- **Q4 – Live rate fetch + progress refetch**:
  - Fetches from `https://rates.staging.api.paytron.com/rate/public` and displays `retailRate`.
  - Progress bar reaches the end → triggers refetch.
  - UI freezes amounts/currency/icons during loading/debouncing/error to avoid flicker.

### How to run
- **Method A: Developer mode (local)**
  - Requirements: Node 18+
  - Install: `npm ci`
  - Start: `npm start` (serves on `http://localhost:3000`)
  - Tests: `CI=true npm test -- --coverage --watchAll=false`

- **Method B: Dev container (Docker)**
  - Prerequisite: Docker is running (Docker Desktop on macOS/Windows, or Docker daemon on Linux). Verify with `docker version`.
  - Build: `docker build -t ofx-fe-test:dev .`
  - Run (with hot reload):
    - `docker run --rm -it -p 3000:3000 -v "$PWD":/app -v /app/node_modules ofx-fe-test:dev`
  - Open `http://localhost:3000`

No environment variables are required.

### Tests & Coverage
- Stack: Jest + React Testing Library
- Coverage (latest snapshot):
  - **Statements** ~94%
  - **Branches** ~88%
  - **Functions** ~91%
  - **Lines** ~95%

### Technical Notes
- **Robust data fetching** (`useExchangeRate`)
  - Timeout + retry with simple backoff for timeouts.
  - "Last request wins" guard so stale responses can’t override newer data.
  - Errors surface to the UI; a retry button is provided.
- **UI stability**
  - Display freezes while loading/debouncing/error to avoid flicker (amounts, currency, icons).
- **Input**
  - Debounced value and debouncing flag.
  - Validation rules (numbers only, single dot, max integer/decimal digits).
  - Parent notified only on real changes to avoid render-effect loops.
- **Docker**
  - Dev-only Dockerfile for hot-reload development.

### API
- Base: `https://rates.staging.api.paytron.com/rate/public`
- Uses `retailRate` from response as the displayed rate.
- Markup: 0.5% applied for the displayed “after markup” amount.

### How to impress further
- **Accessibility**: Keyboard navigation for dropdowns, ARIA attributes for inputs and loader, focus management on open/close.
- **i18n/Localization**: Extract copy, format numbers/currencies per locale.
- **Visual testing**: Storybook stories and visual regression tests.
- **E2E tests**: Playwright/Cypress for happy paths (dropdown select, input, refetch cycle).
- **Error boundaries**: Wrap critical UI to handle render-time exceptions.
- **CI**: Add a GitHub Action to run lint/test/coverage threshold gates.
- **Type safety**: Port hooks/utils to TypeScript for stronger contracts.