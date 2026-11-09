import type { Locator, Page } from '@playwright/test';

export class FileUploadPage {
  readonly fileInput: Locator;
  readonly submit: Locator;
  readonly heading: Locator;
  readonly uploadedFiles: Locator;

  constructor(private readonly page: Page) {
    this.fileInput = page.locator('#file-upload');
    this.submit = page.locator('#file-submit');
    this.heading = page.getByRole('heading', { name: 'File Uploaded!' });
    this.uploadedFiles = page.locator('#uploaded-files');
  }

  async open(): Promise<void> {
    await this.page.goto('/upload');
  }

  async chooseFile(file: { name: string; mimeType: string; buffer: Buffer }): Promise<void> {
    await this.fileInput.setInputFiles(file);
  }

  async upload(): Promise<void> {
    await this.submit.click();
  }
}
