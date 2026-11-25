import type { Locator, Page } from '@playwright/test';

export class DatePickerPage {
  readonly dateInput: Locator;
  readonly dateTimeInput: Locator;
  /** The open react-datepicker dialog. Absent until an input is focused. */
  readonly calendar: Locator;
  readonly monthSelect: Locator;
  readonly yearSelect: Locator;
  readonly currentMonth: Locator;
  readonly previousMonth: Locator;
  readonly nextMonth: Locator;
  /** The day the calendar marks selected. */
  readonly selectedDay: Locator;
  /** Date And Time uses a button list, not the native month select. */
  readonly monthReadView: Locator;
  readonly selectedYear: Locator;

  constructor(private readonly page: Page) {
    this.dateInput = page.locator('#datePickerMonthYearInput');
    this.dateTimeInput = page.locator('#dateAndTimePickerInput');
    this.calendar = page.locator('.react-datepicker');
    this.monthSelect = this.calendar.locator('.react-datepicker__month-select');
    this.yearSelect = this.calendar.locator('.react-datepicker__year-select');
    this.currentMonth = this.calendar.locator('.react-datepicker__current-month');
    this.previousMonth = this.calendar.getByRole('button', { name: 'Previous Month' });
    this.nextMonth = this.calendar.getByRole('button', { name: 'Next Month' });
    this.selectedDay = this.calendar.locator('[role="gridcell"][aria-selected="true"]');
    this.monthReadView = this.calendar.locator('.react-datepicker__month-read-view');
    this.selectedYear = this.calendar.locator('.react-datepicker__year-read-view--selected-year');
  }

  async open(): Promise<void> {
    await this.page.goto('/date-picker');
  }

  async openDate(): Promise<void> {
    await this.dateInput.click();
  }

  async openDateTime(): Promise<void> {
    await this.dateTimeInput.click();
  }

  async chooseMonth(month: string): Promise<void> {
    await this.monthSelect.selectOption({ label: month });
  }

  async chooseYear(year: string): Promise<void> {
    await this.yearSelect.selectOption(year);
  }

  async chooseDay(name: RegExp): Promise<void> {
    await this.calendar.getByRole('gridcell', { name }).click();
  }

  /**
   * The selected month's label is prefixed with a check mark, so the match
   * allows that prefix and nothing else.
   */
  async chooseDateTimeMonth(month: string): Promise<void> {
    await this.monthReadView.click();
    await this.calendar
      .locator('.react-datepicker__month-option')
      .filter({ hasText: new RegExp(`^✓?${month}$`) })
      .click();
  }

  async chooseTime(label: string): Promise<void> {
    await this.calendar.getByText(label, { exact: true }).click();
  }

  async typeDate(value: string): Promise<void> {
    await this.dateInput.click();
    await this.dateInput.fill(value);
    await this.dateInput.press('Enter');
  }
}
