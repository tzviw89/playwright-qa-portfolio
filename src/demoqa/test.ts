import { test as base, expect } from '@playwright/test';
import { blockDemoQaAds } from './ads';
import { ButtonsPage } from './buttons.page';
import { CheckboxPage } from './checkbox.page';
import { PracticeFormPage } from './practice-form.page';
import { RadioButtonPage } from './radio-button.page';
import { SelectMenuPage } from './select-menu.page';
import { TextBoxPage } from './text-box.page';
import { WebTablesPage } from './web-tables.page';

type DemoQaFixtures = {
  buttons: ButtonsPage;
  checkbox: CheckboxPage;
  practiceForm: PracticeFormPage;
  radioButton: RadioButtonPage;
  selectMenu: SelectMenuPage;
  textBox: TextBoxPage;
  webTables: WebTablesPage;
};

/**
 * Every DemoQA page gets ad traffic aborted on the context so overlays
 * never cover Submit, radio labels, table actions, the button row, the check box tree,
 * or the select menus.
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

  checkbox: async ({ page }, use) => {
    const checkbox = new CheckboxPage(page);
    await checkbox.open();
    await use(checkbox);
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

  selectMenu: async ({ page }, use) => {
    const selectMenu = new SelectMenuPage(page);
    await selectMenu.open();
    await use(selectMenu);
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
