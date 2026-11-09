import type { Locator, Page } from '@playwright/test';
import type { TableRecord } from './catalog';

export class WebTablesPage {
  readonly addButton: Locator;
  readonly searchBox: Locator;
  readonly rows: Locator;

  constructor(private readonly page: Page) {
    this.addButton = page.locator('#addNewRecordButton');
    this.searchBox = page.locator('#searchBox');
    this.rows = page.locator('tbody tr');
  }

  async open(): Promise<void> {
    await this.page.goto('/webtables');
  }

  rowFor(email: string): Locator {
    return this.rows.filter({ hasText: email });
  }

  async addRecord(record: TableRecord): Promise<void> {
    await this.addButton.click();
    await this.page.locator('#firstName').fill(record.firstName);
    await this.page.locator('#lastName').fill(record.lastName);
    await this.page.locator('#userEmail').fill(record.email);
    await this.page.locator('#age').fill(record.age);
    await this.page.locator('#salary').fill(record.salary);
    await this.page.locator('#department').fill(record.department);
    await this.page.locator('#submit').click();
  }

  async search(query: string): Promise<void> {
    await this.searchBox.fill(query);
  }

  async deleteByEmail(email: string): Promise<void> {
    await this.rowFor(email).locator('[title="Delete"]').click();
  }
}
