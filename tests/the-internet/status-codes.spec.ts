import { expect, test } from '@playwright/test';
import { statusCodes, StatusCodesPage } from '../../src/the-internet/status-codes.page';

test.describe('status codes', () => {
  for (const code of statusCodes) {
    test(`clicking ${code} lands on that status page`, async ({ page }) => {
      const status = new StatusCodesPage(page);
      await status.open();
      await status.openCode(code);

      await expect(page).toHaveURL(new RegExp(`/status_codes/${code}$`));
      await expect(status.result).toContainText(`This page returned a ${code} status code`);
    });
  }
});
