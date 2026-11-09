import { tableRecord } from '../../src/demoqa/catalog';
import { expect, test } from '../../src/demoqa/test';

test.describe('web tables', () => {
  test('adds, finds, and deletes a row', async ({ webTables }) => {
    await webTables.addRecord(tableRecord);

    await webTables.search(tableRecord.email);
    const row = webTables.rowFor(tableRecord.email);
    await expect(row).toHaveCount(1);
    await expect(row).toContainText(tableRecord.firstName);
    await expect(row).toContainText(tableRecord.lastName);
    await expect(row).toContainText(tableRecord.department);

    await webTables.deleteByEmail(tableRecord.email);
    await expect(webTables.rowFor(tableRecord.email)).toHaveCount(0);
  });
});
