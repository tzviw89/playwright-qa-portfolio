# playwright-qa-portfolio

[![Playwright](https://github.com/tzviw89/playwright-qa-portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/tzviw89/playwright-qa-portfolio/actions/workflows/playwright.yml)

Playwright Test suites against public practice sites. The structure is the part worth reading: one project per site, page objects that follow the screens, and a fixture only where a spec needs shared setup.

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

A few Elemental Selenium exercises. Heroku sometimes takes a while to answer, so this project has a longer timeout than Swag Labs.

| Spec | What it checks |
| --- | --- |
| `tests/the-internet/form-auth.spec.ts` | published demo user, logout, rejected password |
| `tests/the-internet/checkboxes.spec.ts` | default state, then both toggled |
| `tests/the-internet/dropdown.spec.ts` | selecting an option |
| `tests/the-internet/dynamic-loading.spec.ts` | the heading is absent until Start finishes |

`@smoke` is the short path: standard-user login, the checkout total, form auth, and dynamic loading. CI runs the full suite.

## Demo accounts

**Swag Labs.** Password for every user is `secret_sauce`. The login page lists them.

| Username | In this suite |
| --- | --- |
| `standard_user` | signed-in flows |
| `locked_out_user` | login failure |
| `problem_user`, `performance_glitch_user`, `error_user`, `visual_user` | not used. They break images, timing, specific buttons, or layout on purpose |

**The Internet form authentication.** `tomsmith` / `SuperSecretPassword!`, printed on the login page.

## Run

Node.js 22 or newer.

```bash
npm install
npx playwright install --with-deps chromium
npx playwright test
```

Slices:

```bash
npx playwright test --project=saucedemo
npx playwright test --project=the-internet
npx playwright test --grep @smoke
npx playwright test tests/saucedemo/checkout.spec.ts
npx playwright show-report
```

On failure, Playwright keeps a screenshot. A trace is kept on the first retry (`npx playwright show-trace <trace.zip>`). CI retries twice and uploads the HTML report when the job fails.

## Layout

```
playwright.config.ts     one Playwright project per site
src/saucedemo/           page objects, catalog, the signed-in fixture
src/the-internet/
tests/saucedemo/
tests/the-internet/
```

Locators and actions live on the page objects. Assertions stay in the specs. The Swag Labs `shop` fixture is the exception: it signs in as `standard_user` and waits for the Products heading before the test body runs. Login specs use a separate fixture that only opens the form, so a locked-out user is not fighting a saved session.

Swag Labs exposes `data-test` (set as Playwright's `testIdAttribute`). Where a control has an accessible name — Login, Sort products, Add to cart — the page object uses that instead. The Internet pages are plain HTML, so those objects use labels and roles.

## Adding a site

1. Add `src/<site>/` and `tests/<site>/`.
2. Register a project in `playwright.config.ts` with that `testDir` and `baseURL`.
3. Keep accounts next to the page objects, and only accounts the practice site publishes.

Worth a later PR, still public sandboxes: [DemoQA](https://demoqa.com/), [UI Testing Playground](http://uitestingplayground.com/), [Practice Software Testing](https://practicesoftwaretesting.com/), [Swagger Petstore](https://petstore.swagger.io/).

## CI

[`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) typechecks and runs `npx playwright test` on pull requests and on pushes to `main`. Chromium only, two workers.
