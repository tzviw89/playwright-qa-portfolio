import { expect, test } from '@playwright/test';
import { JavaScriptAlertsPage } from '../../src/the-internet/javascript-alerts.page';

test.describe('javascript alerts', () => {
  test('accepts a JS alert', async ({ page }) => {
    const alerts = new JavaScriptAlertsPage(page);
    await alerts.open();

    const dialogPromise = page.waitForEvent('dialog');
    const clickPromise = alerts.alertButton.click();
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe('alert');
    expect(dialog.message()).toBe('I am a JS Alert');
    await dialog.accept();
    await clickPromise;

    await expect(alerts.result).toHaveText('You successfully clicked an alert');
  });

  test('dismisses a JS confirm', async ({ page }) => {
    const alerts = new JavaScriptAlertsPage(page);
    await alerts.open();

    const dialogPromise = page.waitForEvent('dialog');
    const clickPromise = alerts.confirmButton.click();
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe('confirm');
    expect(dialog.message()).toBe('I am a JS Confirm');
    await dialog.dismiss();
    await clickPromise;

    await expect(alerts.result).toHaveText('You clicked: Cancel');
  });

  test('fills a JS prompt', async ({ page }) => {
    const alerts = new JavaScriptAlertsPage(page);
    await alerts.open();

    const dialogPromise = page.waitForEvent('dialog');
    const clickPromise = alerts.promptButton.click();
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe('prompt');
    expect(dialog.message()).toBe('I am a JS prompt');
    await dialog.accept('Playwright');
    await clickPromise;

    await expect(alerts.result).toHaveText('You entered: Playwright');
  });
});
