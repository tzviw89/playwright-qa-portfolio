import { expect, test } from '../../src/demoqa/test';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** Accessible name of the day cell for a MM/DD/YYYY field value. */
function selectedDayName(value: string): RegExp {
  const [month, day, year] = value.split('/');
  const monthName = MONTHS[Number(month) - 1];
  const n = Number(day);
  const mod = n % 100;
  const suffix =
    mod >= 11 && mod <= 13 ? 'th' : n % 10 === 1 ? 'st' : n % 10 === 2 ? 'nd' : n % 10 === 3 ? 'rd' : 'th';
  return new RegExp(`^Choose \\w+, ${monthName} ${n}${suffix}, ${year}$`);
}

test.describe('date picker', () => {
  test('opens on the date already in the field', async ({ datePicker }) => {
    await expect(datePicker.dateInput).toHaveValue(/^\d{2}\/\d{2}\/\d{4}$/);
    const value = await datePicker.dateInput.inputValue();
    const [, , year] = value.split('/');
    const monthName = MONTHS[Number(value.slice(0, 2)) - 1];

    await datePicker.openDate();

    await expect(datePicker.currentMonth).toHaveText(`${monthName} ${year}`);
    await expect(datePicker.monthSelect.locator('option:checked')).toHaveText(monthName);
    await expect(datePicker.yearSelect.locator('option:checked')).toHaveText(year);
    await expect(datePicker.selectedDay).toHaveAttribute('aria-label', selectedDayName(value));
  });

  test('writes the month, year, and day chosen in the calendar', async ({ datePicker }) => {
    await datePicker.openDate();
    await datePicker.chooseMonth('January');
    await datePicker.chooseYear('2020');

    await expect(datePicker.currentMonth).toHaveText('January 2020');

    await datePicker.chooseDay(/January 15th, 2020/);

    await expect(datePicker.dateInput).toHaveValue('01/15/2020');
    await expect(datePicker.calendar).toHaveCount(0);
  });

  test('moves between months with the calendar arrows', async ({ datePicker }) => {
    await datePicker.openDate();
    await datePicker.chooseMonth('January');
    await datePicker.chooseYear('2020');
    await datePicker.chooseDay(/January 15th, 2020/);
    await expect(datePicker.dateInput).toHaveValue('01/15/2020');

    await datePicker.openDate();
    await datePicker.nextMonth.click();
    await expect(datePicker.currentMonth).toHaveText('February 2020');
    await datePicker.chooseDay(/February 2nd, 2020/);
    await expect(datePicker.dateInput).toHaveValue('02/02/2020');
    await expect(datePicker.calendar).toHaveCount(0);

    await datePicker.openDate();
    await datePicker.previousMonth.click();
    await expect(datePicker.currentMonth).toHaveText('January 2020');
    await datePicker.chooseDay(/January 31st, 2020/);
    await expect(datePicker.dateInput).toHaveValue('01/31/2020');
  });

  test('keeps a typed leap day and rejects a day that month does not have', async ({ datePicker }) => {
    await datePicker.typeDate('02/29/2024');
    await expect(datePicker.dateInput).toHaveValue('02/29/2024');
    await expect(datePicker.calendar).toHaveCount(0);

    await datePicker.typeDate('02/30/2024');
    await expect(datePicker.dateInput).toHaveValue('02/29/2024');
  });

  test('writes a date and a time from the time list', async ({ datePicker }) => {
    await datePicker.openDateTime();
    await datePicker.chooseDateTimeMonth('March');
    const year = (await datePicker.selectedYear.innerText()).trim();

    await datePicker.chooseDay(new RegExp(`March 1st, ${year}`));

    await expect(datePicker.dateTimeInput).toHaveValue(new RegExp(`^March 1, ${year} \\d{1,2}:\\d{2} [AP]M$`));
    await expect(datePicker.calendar).toBeVisible();

    await datePicker.chooseTime('14:00');

    await expect(datePicker.dateTimeInput).toHaveValue(`March 1, ${year} 2:00 PM`);
    await expect(datePicker.calendar).toHaveCount(0);
  });
});
