import type { Locator, Page } from '@playwright/test';
import type { Student } from './catalog';

const genderRadioId: Record<Student['gender'], string> = {
  Male: 'gender-radio-1',
  Female: 'gender-radio-2',
  Other: 'gender-radio-3',
};

export class PracticeFormPage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly mobile: Locator;
  readonly submit: Locator;
  readonly confirmationTitle: Locator;
  readonly confirmationTable: Locator;

  constructor(private readonly page: Page) {
    this.firstName = page.locator('#firstName');
    this.lastName = page.locator('#lastName');
    this.email = page.locator('#userEmail');
    this.mobile = page.locator('#userNumber');
    this.submit = page.locator('#submit');
    this.confirmationTitle = page.locator('#example-modal-sizes-title-lg');
    this.confirmationTable = page.locator('.modal-body table');
  }

  async open(): Promise<void> {
    await this.page.goto('/automation-practice-form');
  }

  async selectGender(gender: Student['gender']): Promise<void> {
    // Radios are covered by their labels; click the label text.
    await this.page.locator(`label[for="${genderRadioId[gender]}"]`).click();
  }

  async fillRequired(student: Student): Promise<void> {
    await this.firstName.fill(student.firstName);
    await this.lastName.fill(student.lastName);
    if (student.email) {
      await this.email.fill(student.email);
    }
    await this.selectGender(student.gender);
    await this.mobile.fill(student.mobile);
  }

  async submitForm(): Promise<void> {
    await this.submit.scrollIntoViewIfNeeded();
    await this.submit.click();
  }

  /** Value cell for a given confirmation-modal label. */
  confirmationValue(label: string): Locator {
    return this.confirmationTable.locator('tbody tr').filter({ hasText: label }).locator('td').nth(1);
  }
}
