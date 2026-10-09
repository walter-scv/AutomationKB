// tests/base-test.ts
import { test as base, expect } from '@playwright/test';
import { buyAsset, sellAsset, Order } from '../helpers';

/**
 * Extended test fixture for all E2E tests.
 *
 * Import `test` and `expect` from this file instead of `@playwright/test`:
 *   import { test, expect } from '../base-test';
 *
 * seedPosition: Setup & Cleanup fixture — buys an asset via API before the
 * test runs, and sells it back after, regardless of pass/fail:
 *
 *   test('...', async ({ page, seedPosition }) => {
 *     await seedPosition(anOrder().forAsset('a3').withAmount(50).build());
 *     // ...test body, reads the seeded position, never sells it itself...
 *   });
 *
 * Add more shared fixtures here as the suite grows — an authenticated page,
 * anything every test file would otherwise have to set up on its own.
 */
export const test = base.extend<{
  seedPosition: (order: Order) => Promise<void>;
  // authenticatedPage: Page;
}>({
  seedPosition: async ({ page }, use) => {
    const seeded: Order[] = [];

    await use(async (order) => {
      await buyAsset(page.request, order);
      seeded.push(order);
    });

    // CLEANUP — runs after the test, pass or fail: sell back exactly what
    // this fixture bought, in reverse order. Assumes the test itself never
    // sells the same position — if it does, seed a position the test
    // doesn't touch, or sell it within the test instead of using this fixture.
    for (const order of seeded.reverse()) {
      await sellAsset(page.request, order);
    }
  },

  // authenticatedPage: async ({ page }, use) => {
  //   await page.goto('/login');
  //   await page.getByLabel('Email').fill(process.env.TEST_USER_EMAIL ?? '');
  //   await page.getByLabel('Password').fill(process.env.TEST_USER_PASSWORD ?? '');
  //   await page.getByRole('button', { name: 'Sign In' }).click();
  //   await page.waitForURL(/dashboard/);
  //   await use(page);
  // },
});

export { expect };
