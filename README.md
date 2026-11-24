# playwright-qa-portfolio

[![Playwright](https://github.com/tzviw89/playwright-qa-portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/tzviw89/playwright-qa-portfolio/actions/workflows/playwright.yml)

Playwright Test suites against public practice sites — four UI projects and three API projects. The structure is the part worth reading: one Playwright project per site, page objects (or a thin request client) next to the screens they wrap, and fixtures only where shared setup would otherwise repeat.

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
| `tests/the-internet/hovers.spec.ts` | hovering an avatar shows that user's name and profile link |
| `tests/the-internet/key-presses.spec.ts` | the result names the key that was pressed |
| `tests/the-internet/add-remove-elements.spec.ts` | Add Element creates Delete buttons; Delete removes one |
| `tests/the-internet/status-codes.spec.ts` | clicking 200, 301, 404, and 500 lands on that status page |
| `tests/the-internet/basic-auth.spec.ts` | published admin/admin; a request without credentials returns 401 |

### [Restful Booker](https://restful-booker.herokuapp.com/) (API)

Request-only project against the public Restful Booker practice API. Specs use Playwright's `request` fixture — no browser, no page objects. `src/restful-booker/client.ts` wraps auth, create, read, PUT, PATCH, and delete. Payloads come from `sampleBooking()`. The published demo admin account is the `admin` constant in `src/restful-booker/accounts.ts` (`admin` / `password123`).

Each booking test creates its own record and passes the id to the `bookings` fixture, which deletes it afterwards. The demo keeps bookings in memory and can drop them on restart; a cleanup delete that finds nothing (404 or 405) is ignored. The delete check itself still expects 201, then 404 on the following read. A delete with no token expects 403, and the booking is still there.

| Spec | What it checks |
| --- | --- |
| `tests/restful-booker/health.spec.ts` | `GET /ping` returns 201 |
| `tests/restful-booker/booking.spec.ts` | auth token; create then read fields; PUT and PATCH, then delete (201, then 404); delete without a token returns 403 |

### [Swagger Petstore](https://petstore.swagger.io/v2) (API)

Request-only project against the public Swagger Petstore demo. Specs use Playwright's `request` fixture — no browser, no page objects. `src/petstore/client.ts` wraps create, read, PUT, find by status, and delete. Payloads come from `samplePet()`, which assigns a fresh id in a high range so a run does not collide with the small ids the shared store keeps rewriting. These calls do not send an api key.

Each pet test creates its own record and passes the id to the `pets` fixture, which deletes it afterwards. A cleanup delete that finds nothing (404) is ignored. The delete check itself still expects 200, then 404 on the following read. Find-by-status only checks that this pet is in the list; the other rows belong to everyone else using the demo.

| Spec | What it checks |
| --- | --- |
| `tests/petstore/pet.spec.ts` | create, read by id, PUT, find by status, delete (200, then GET 404) |

### [Practice Software Testing](https://api.practicesoftwaretesting.com/) (API)

Request-only project against the public Practice Software Testing catalog. Specs use Playwright's `request` fixture — no browser, no page objects, no login. `src/practice-api/client.ts` wraps the GETs. The suite does not create or update anything.

`GET /products` returns a page (`current_page`, `data`, `from`, `last_page`, `per_page`, `to`, `total`). Counts and page size come from that payload. Each row is checked for the product fields the catalog returns, including category, brand, and image. One id from the list is read with `GET /products/{id}`; the detail adds `specs`, and the shared fields are compared to the list row. `q` filters by product name, case-insensitively. The search test uses a name from the list, then checks that every hit contains it. Categories and brands are arrays. An unknown product id returns 404 with `Requested item not found`. The `productPage` fixture loads the first page for specs that need a real id.

| Spec | What it checks |
| --- | --- |
| `tests/practice-api/products.spec.ts` | paginated product list, read by id, `q` name filter, unknown id 404 |
| `tests/practice-api/catalog.spec.ts` | categories (including parent ids), brands |

### [DemoQA](https://demoqa.com/)

Practice Form, Web Tables, Text Box, Radio Button, Buttons, Check Box, and Select Menu. Third-party ad domains are aborted on the browser context (`src/demoqa/ads.ts`) so overlays never cover Submit, radio labels, table actions, the button row, the check box tree, or the select menus.

| Spec | What it checks |
| --- | --- |
| `tests/demoqa/practice-form.spec.ts` | required fields appear in the confirmation modal; missing first name stays on the form |
| `tests/demoqa/web-tables.spec.ts` | add a row, find it by search, delete it |
| `tests/demoqa/text-box.spec.ts` | submitted name, email, and addresses appear in the output; invalid email shows an error and no output |
| `tests/demoqa/radio-button.spec.ts` | Yes and Impressive can be selected; No is disabled |
| `tests/demoqa/buttons.spec.ts` | double click, right click, and dynamic click each show their message |
| `tests/demoqa/checkbox.spec.ts` | a checked leaf is listed on its own; a parent checks its children and turns mixed when one is cleared |
| `tests/demoqa/select-menu.spec.ts` | a grouped option replaced by a root option, a title, the old-style color, several colors with one removed, and the standard multi-select |

### [UI Testing Playground](http://uitestingplayground.com/)

Locator and synchronization exercises. The client-delay label is inserted after 15 seconds, so this project uses a longer test timeout and the assertion waits — there is no `waitForTimeout`.

| Spec | What it checks |
| --- | --- |
| `tests/uitestingplayground/dynamic-id.spec.ts` | the button is clicked by its name; the generated id changes on reload |
| `tests/uitestingplayground/client-delay.spec.ts` | the calculated label is absent until client-side processing finishes |
| `tests/uitestingplayground/text-input.spec.ts` | the button label becomes the text entered in the field |
| `tests/uitestingplayground/visibility.spec.ts` | removed, zero-width, and styled-out buttons are hidden; opacity 0, offscreen, and overlapped buttons stay visible |

`@smoke` is the short path: Sauce Demo standard-user login and checkout total, The Internet form auth and dynamic loading, Restful Booker ping, DemoQA practice-form submit, and UI Testing Playground dynamic id and text input. CI runs the full suite.

## Design choices

- **One project per site.** Each entry in `playwright.config.ts` owns its `testDir` and `baseURL` (or request headers for the API projects). Timeouts are longer where the host or the scenario needs it: Heroku cold starts, the shared Petstore demo, and the playground's 15-second client-side delay.
- **Page objects hold locators and actions; assertions stay in specs.** UI suites follow that split. Restful Booker, Petstore, and Practice Software Testing have no pages — helpers take an `APIRequestContext` instead.
- **Fixtures only where setup repeats.** Sauce Demo's `shop` fixture signs in as `standard_user` before inventory/checkout specs; login specs use a fixture that only opens the form. DemoQA fixtures open the target page and block ad routes on the shared context. Restful Booker's `bookings` fixture records ids the spec created and deletes them after the test. Petstore's `pets` fixture does the same, and a 404 on cleanup counts as already gone. Practice Software Testing's `productPage` fixture reads the first product page so a spec can pick a real id. That project only sends GETs.
- **`@smoke` tags** mark a thin cross-project slice (`npm run test:smoke` / `--grep @smoke`). They are not a separate CI job.
- **API vs UI.** Restful Booker, Petstore, and Practice Software Testing are request-only so the portfolio shows both browser automation and HTTP checks without mixing them in one project.
- **CI.** GitHub Actions (`.github/workflows/playwright.yml`) typechecks, runs the triage unit tests, and runs `npx playwright test` on pull requests and pushes to `main`. Chromium only, two workers, retries twice on CI, uploads the HTML report when Playwright fails. After Playwright, a triage step reads the JSON report. That step is `continue-on-error`, so a missing report or a model error stays in the log.

## Demo accounts

**Swag Labs.** Password for every user is `secret_sauce`. The login page lists them.

| Username | In this suite |
| --- | --- |
| `standard_user` | signed-in flows |
| `locked_out_user` | login failure |
| `problem_user`, `performance_glitch_user`, `error_user`, `visual_user` | not used. They break images, timing, specific buttons, or layout on purpose |

**The Internet form authentication.** `tomsmith` / `SuperSecretPassword!`, printed on the login page.

**The Internet basic auth.** `admin` / `admin`, printed next to the Basic Auth link on the home page.

**Restful Booker auth.** Defaults to the published `admin` / `password123`. Override with `BOOKER_USERNAME` / `BOOKER_PASSWORD` if needed.

**Swagger Petstore.** No login. The pet calls in this suite do not send an api key.

**Practice Software Testing.** No login. The catalog checks send GET requests only.

**DemoQA.** No login. Specs use invented student, table-record, and text-box data in `src/demoqa/catalog.ts`.

**UI Testing Playground.** No login.

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
npx playwright test --project=petstore
npx playwright test --project=practice-api
npx playwright test --project=demoqa
npx playwright test --project=uitestingplayground
# same via:
npm run test:saucedemo
npm run test:the-internet
npm run test:restful-booker
npm run test:petstore
npm run test:practice-api
npm run test:demoqa
npm run test:uitestingplayground
```

Smoke and report:

```bash
npm run test:smoke
npx playwright test --grep @smoke
npx playwright show-report
```

Single file example: `npx playwright test tests/saucedemo/checkout.spec.ts`.

On failure, Playwright keeps a screenshot. A trace is kept on the first retry (`npx playwright show-trace <trace.zip>`).

## Failure triage

`npm run triage` reads Playwright's JSON report (`test-results/results.json`) and writes `triage-summary.md`. It keeps failed tests and tests that passed on retry, then suggests a label for each one: `flaky`, `product bug`, or `test bug`.

Rules run first. A pass on retry is flaky. A locator timeout or a strict-mode violation is a test bug. An HTTP 5xx response, or a wrong value returned by the app, is a product bug. When `OPENAI_API_KEY` is set, a model suggests labels for whatever the rules leave open. Labels are suggestions. The sample report, the rules, and the fake-model tests are in [`triage/README.md`](triage/README.md).

```bash
npm run triage
npm run test:triage
```

## Layout

```
playwright.config.ts     one Playwright project per site
triage/                   failure triage agent, sample report, unit tests
src/saucedemo/           page objects, catalog, signed-in fixture
src/the-internet/        page objects and published demo credentials
src/restful-booker/      booking types, sample payload, request client, cleanup fixture
src/petstore/            pet types, sample payload, request client, cleanup fixture
src/practice-api/        catalog types, request client, product-page fixture
src/demoqa/              page objects, catalog, ad blocking, fixtures
src/uitestingplayground/ page objects for locator and sync challenges
tests/saucedemo/
tests/the-internet/
tests/restful-booker/
tests/petstore/
tests/practice-api/
tests/demoqa/
tests/uitestingplayground/
```

Swag Labs exposes `data-test` (set as Playwright's `testIdAttribute`). Where a control has an accessible name — Login, Sort products, Add to cart — the page object uses that instead. The Internet pages are plain HTML, so those objects use labels and roles. DemoQA often needs ids and label-for clicks because of how the form is marked up. The plain Buttons control has a generated id, so that page object uses the accessible name Click Me.

## Adding a site

1. Add `src/<site>/` and `tests/<site>/`.
2. Register a project in `playwright.config.ts` with that `testDir` and `baseURL` (or request `use` for an API-only suite).
3. Keep accounts next to the page objects or client, and only accounts the practice site publishes.
4. Add an npm script if you want a one-liner for that project.

## CI

[`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) typechecks, runs `npm run test:triage`, and runs `npx playwright test` on pull requests and on pushes to `main`. Chromium only, two workers. The triage unit tests use a fake model. After Playwright, `npm run triage` runs with `if: always()` and `continue-on-error`. It calls a model only when the `OPENAI_API_KEY` repository secret is set; otherwise it stays on the rules.
