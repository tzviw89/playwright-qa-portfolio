import { expect, test } from '@playwright/test';
import { FileUploadPage } from '../../src/the-internet/file-upload.page';

test.describe('file upload', () => {
  test('uploads a chosen file and shows its name', async ({ page }) => {
    const upload = new FileUploadPage(page);
    await upload.open();

    await upload.chooseFile({
      name: 'upload-sample.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('playwright portfolio upload sample\n'),
    });
    await upload.upload();

    await expect(upload.heading).toBeVisible();
    await expect(upload.uploadedFiles).toHaveText('upload-sample.txt');
  });
});
