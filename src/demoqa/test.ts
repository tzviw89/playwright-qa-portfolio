import { test as base, expect } from '@playwright/test';
import { blockDemoQaAds } from './ads';
import { ButtonsPage } from './buttons.page';
import { PracticeFormPage } from './practice-form.page';
import { RadioButtonPage } from './radio-button.page';
import { TextBoxPage } from './text-box.page';
import { WebTablesPage } from './web-tables.page';

type DemoQaFixtures = {
  buttons: ButtonsPage;
  practiceForm: PracticeFormPage;
  radioButton: RadioButtonPage;
  textBox: TextBoxPage;
  webTables: WebTablesPage;
};

/**
 * Every DemoQA page gets ad traffic aborted on the context so overlays
 * never cover Submit, radio labels, table actions, or the button row.
 */
export const test = base.extend<DemoQaFixtures>({
  context: async ({ context }, use) => {
    await blockDemoQaAds(context);
    await use(context);
  },

  buttons: async ({ page }, use) => {
    const buttons = new ButtonsPage(page);
    await buttons.open();
    await use(buttons);
  },

  practiceForm: async ({ page }, use) => {
    const practiceForm = new PracticeFormPage(page);
    await practiceForm.open();
    await use(practiceForm);
  },

  radioButton: async ({ page }, use) => {
    const radioButton = new RadioButtonPage(page);
    await radioButton.open();
    await use(radioButton);
  },

  textBox: async ({ page }, use) => {
    const textBox = new TextBoxPage(page);
    await textBox.open();
    await use(textBox);
  },

  webTables: async ({ page }, use) => {
    const webTables = new WebTablesPage(page);
    await webTables.open();
    await use(webTables);
  },
});

export { expect };
