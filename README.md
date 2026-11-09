# playwright-qa-portfolio

[![Playwright](https://github.com/tzviw89/playwright-qa-portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/tzviw89/playwright-qa-portfolio/actions/workflows/playwright.yml)

Playwright Test suites against public practice sites — three UI projects and one API project. The structure is the part worth reading: one Playwright project per site, page objects (or a thin request client) next to the screens they wrap, and fixtures only where shared setup would otherwise repeat.

Nothing here targets a private or employer application. The accounts below are the ones the sandboxes publish themselves.

## Covered now

### [Sauce Demo](https://www.saucedemo.com/) (Swag Labs)

Login, catalog sorting, the cart badge, and checkout. Tax is asserted, not just the thank-you message: Swag Labs charges 8% of the item subtotal, rounds that tax to the cent, and adds it back.

| Spec | What it checks |
| --- | --- |
| `tests/saucedemo/login.spec.ts` | standard user, locked-out user, bad password, blank username |
| `tests/saucedemo/inventory.spec.ts` | default A–Z order, Z–A, price low to high, cart badge, logout |
| `tests/saucedemo/checkout.spec.ts` | taxed total after removing a line, required first/last/postal fields, continue after fixing validation |

### [The Internet](https://the-internet.herokuapp.com/)

Elemental Selenium exercises. Heroku sometimes takes a while to answer, so this project has a longer timeout than Swag Labs.

| Spec | What it checks |
| --- | --- |
| `tests/the-internet/form-auth.spec.ts` | published demo user, logout, rejected password |
| `tests/the-internet/checkboxes.spec.ts` | default state, then both toggled |
| `tests/the-internet/dropdown.spec.ts` | selecting an option |
| `tests/the-internet/dynamic-loading.spec.ts` | the heading is absent until Start finishes |
| `tests/the-internet/javascript-alerts.spec.ts` | accept a JS alert, dismiss a confirm, fill a prompt |
| `tests/the-internet/file-upload.spec.ts` | upload via `setInputFiles`, assert the shown filename |
| `tests/the-internet/dynamic-controls.spec.ts` | async remove/add checkbox, enable/disable text input |

### [Restful Booker](https://restful-booker.herokuapp.com/) (API)

Request-only project. Specs use Playwright's `request` fixture against the public booking API — no browser, no page objects. A small client in `src/restful-booker/` wraps create / read / auth / update / delete; payloads come from `sampleBooking()`.

| Spec | What it checks |
| --- | --- |
| `tests/restful-booker/health.spec.ts` | `GET /ping` returns 201 |
| `tests/restful-booker/booking.spec.ts` | create + read back, token update, token delete, update without a token returns 403 |

### [DemoQA](https://demoqa.com/)

Practice Form and Web Tables. Third-party ad domains are aborted on the browser context (`src/demoqa/ads.ts`) so overlays never cover Submit, radio labels, or table actions.

| Spec | What it checks |
| --- | --- |
| `tests/demoqa/practice-form.spec.ts` | required fields appear in the confirmation modal; missing first name stays on the form |
| `tests/demoqa/web-tables.spec.ts` | add a row, find it by search, delete it |

`@smoke` is the short path: Sauce Demo standard-user login and checkout total, The Internet form auth and dynamic loading, Restful Booker ping, and DemoQA practice-form submit. CI runs the full suite.

## Design choices

- **One project per site.** Each entry in `playwright.config.ts` owns its `testDir` and `baseURL` (or request headers for the API project). Timeouts are longer for Heroku-backed sites.
- **Page objects hold locators and actions; assertions stay in specs.** UI suites follow that split. Restful Booker has no pages — helpers take an `APIRequestContext` instead.
- **Fixtures only where setup repeats.** Sauce Demo's `shop` fixture signs in as `standard_user` before inventory/checkout specs; login specs use a fixture that only opens the form. DemoQA fixtures open the target page and block ad routes on the shared context.
- **`@smoke` tags** mark a thin cross-project slice (`npm run test:smoke` / `--grep @smoke`). They are not a separate CI job.
- **API vs UI.** Restful Booker is deliberately request-only so the portfolio shows both browser automation and HTTP checks without mixing them in one project.
- **CI.** GitHub Actions (`.github/workflows/playwright.yml`) typechecks and runs `npx playwright test` on pull requests and pushes to `main`. Chromium only, two workers, retries twice on CI, uploads the HTML report when the job fails.

## Demo accounts

**Swag Labs.** Password for every user is `secret_sauce`. The login page lists them.

| Username | In this suite |
| --- | --- |
| `standard_user` | signed-in flows |
| `locked_out_user` | login failure |
| `problem_user`, `performance_glitch_user`, `error_user`, `visual_user` | not used. They break images, timing, specific buttons, or layout on purpose |

**The Internet form authentication.** `tomsmith` / `SuperSecretPassword!`, printed on the login page.

**Restful Booker auth.** Defaults to the published `admin` / `password123`. Override with `BOOKER_USERNAME` / `BOOKER_PASSWORD` if needed.

**DemoQA.** No login. Specs use invented student / table-record data in `src/demoqa/catalog.ts`.

## Run

Node.js 22 or newer.

```bash
npm install
npx playwright install --with-deps chromium
npx playwright test
```

Per project (or use the npm scripts):

```bash
npx playwright test --project=saucedemo
npx playwright test --project=the-internet
npx playwright test --project=restful-booker
npx playwright test --project=demoqa
# same via:
npm run test:saucedemo
npm run test:the-internet
npm run test:restful-booker
npm run test:demoqa
```

Smoke and report:

```bash
npm run test:smoke
npx playwright test --grep @smoke
npx playwright show-report
```

Single file example: `npx playwright test tests/saucedemo/checkout.spec.ts`.

On failure, Playwright keeps a screenshot. A trace is kept on the first retry (`npx playwright show-trace <trace.zip>`).

## Layout

```
playwright.config.ts     one Playwright project per site
src/saucedemo/           page objects, catalog, signed-in fixture
src/the-internet/        page objects and published demo credentials
src/restful-booker/      booking types, sample payload, request helpers
src/demoqa/              page objects, catalog, ad blocking, fixtures
tests/saucedemo/
tests/the-internet/
tests/restful-booker/
tests/demoqa/
```

Swag Labs exposes `data-test` (set as Playwright's `testIdAttribute`). Where a control has an accessible name — Login, Sort products, Add to cart — the page object uses that instead. The Internet pages are plain HTML, so those objects use labels and roles. DemoQA often needs ids and label-for clicks because of how the form is marked up.

## Adding a site

1. Add `src/<site>/` and `tests/<site>/`.
2. Register a project in `playwright.config.ts` with that `testDir` and `baseURL` (or request `use` for an API-only suite).
3. Keep accounts next to the page objects or client, and only accounts the practice site publishes.
4. Add an npm script if you want a one-liner for that project.

Worth a later PR, still public sandboxes: [UI Testing Playground](http://uitestingplayground.com/), [Practice Software Testing](https://practicesoftwaretesting.com/).

## CI

[`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) typechecks and runs `npx playwright test` on pull requests and on pushes to `main`. Chromium only, two workers.
