import type { Locator, Page } from '@playwright/test';

export class SelectMenuPage {
  readonly valueMenu: Locator;
  readonly valueLabel: Locator;
  readonly titleMenu: Locator;
  readonly titleLabel: Locator;
  readonly oldStyle: Locator;
  /** The color menu has no id. It is the control directly under that label. */
  readonly colors: Locator;
  /**
   * Chip text. The label has no role; multiValue is the stable part of the
   * generated class name.
   */
  readonly selectedColors: Locator;
  readonly cars: Locator;

  constructor(private readonly page: Page) {
    this.valueMenu = page.locator('#withOptGroup');
    this.valueLabel = this.valueMenu.locator('[class*="singleValue"]');
    this.titleMenu = page.locator('#selectOne');
    this.titleLabel = this.titleMenu.locator('[class*="singleValue"]');
    this.oldStyle = page.locator('#oldSelectMenu');
    this.colors = page.locator('#selectMenuContainer p:has(b:text-is("Multiselect drop down")) + div');
    this.selectedColors = this.colors.locator('[class*="multiValue"] > div:first-child');
    this.cars = page.locator('#cars');
  }

  async open(): Promise<void> {
    await this.page.goto('/select-menu');
  }

  /**
   * Native options stay in the accessibility tree and repeat these labels
   * (Green, Black, Red, Blue), so the open react-select list is the scope.
   */
  private openList(): Locator {
    return this.page.locator('[id^="react-select-"][id$="-listbox"]');
  }

  async choose(menu: Locator, option: string): Promise<void> {
    await menu.getByRole('combobox').click();
    await this.openList().getByRole('option', { name: option, exact: true }).click();
  }

  async chooseColors(options: string[]): Promise<void> {
    await this.colors.getByRole('combobox').click();
    const list = this.openList();
    for (const option of options) {
      await list.getByRole('option', { name: option, exact: true }).click();
    }
    // The menu stays open so more than one color can be chosen.
    await this.page.keyboard.press('Escape');
  }

  async removeColor(label: string): Promise<void> {
    await this.colors.getByRole('button', { name: `Remove ${label}` }).click();
  }

  async chooseOldStyle(label: string): Promise<void> {
    await this.oldStyle.selectOption({ label });
  }

  async chooseCars(labels: string[]): Promise<void> {
    await this.cars.selectOption(labels.map((label) => ({ label })));
  }
}
