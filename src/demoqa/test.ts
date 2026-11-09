import { test as base, expect } from '@playwright/test';
import { blockDemoQaAds } from './ads';
import { PracticeFormPage } from './practice-form.page';
import { WebTablesPage } from './web-tables.page';

type DemoQaFixtures = {
  practiceForm: PracticeFormPage;
  webTables: WebTablesPage;
};

/**
 * Every DemoQA page gets ad traffic aborted on the context so overlays
 * never cover Submit / radio labels / table actions.
 */
export const test = base.extend<DemoQaFixtures>({
  context: async ({ context }, use) => {
    await blockDemoQaAds(context);
    await use(context);
  },

  practiceForm: async ({ page }, use) => {
    const practiceForm = new PracticeFormPage(page);
    await practiceForm.open();
    await use(practiceForm);
  },

  webTables: async ({ page }, use) => {
    const webTables = new WebTablesPage(page);
    await webTables.open();
    await use(webTables);
  },
});

export { expect };
