## End-to-End Testing Plan (Playwright)

### Goals
- Validate core user flows in a real browser across Chromium/Firefox/WebKit.
- Exercise production build with Vite `base` path (`/traditional-chinese-study/`).
- Keep tests stable, fast, and CI-friendly with traces/videos on failure.

### Scope of initial tests
- Smoke: App loads, header and flashcard are visible.
- Kid Mode toggle: Panel visibility switches; persists for the session.
- Filters: Selecting Level/Book/Lesson updates the matching count reliably.
- Flashcard: Reveal/hide answer and navigate next/previous.

### Tooling choice
- Playwright for cross-browser coverage, strong auto-waits, trace viewer, and webServer integration with Vite preview.

### Project layout
- Config: `playwright.config.ts`
- Tests: `tests/e2e/*.spec.ts`

### Server strategy
- Build the app and run `vite preview` for tests. This ensures the prod `base` path is honored.
- Base URL: `http://localhost:4173/traditional-chinese-study/`.

### Scripts
- `pnpm e2e`: run all browsers headless.
- `pnpm e2e:headed`: debug locally with a visible browser.
- `pnpm e2e:ui`: use the Playwright UI mode.
- `pnpm e2e:report`: open the HTML report.

### Authoring guidelines
- Prefer `getByRole` and `getByTestId` for robust selectors.
- Avoid fixed timeouts; rely on Playwright's default auto-waits.
- Keep one user flow per test; keep assertions specific but minimal.
- For data randomness (e.g., sentence cards), assert presence/behavior rather than exact strings.

### Future enhancements
- Visual diffs (Percy/Applitools) for critical pages.
- Mobile viewport/device projects for responsive checks.
- Smoke performance budget via `tracing` and `metrics` sampling.
- Route stubbing if/when APIs are introduced.

### Running locally
```bash
pnpm e2e
# or
pnpm e2e:headed
pnpm e2e:ui
pnpm e2e:report
```

### CI notes
- Cache Playwright browsers and `pnpm` store to speed up runs.
- Use the default HTML reporter artifacts; upload on failure.


