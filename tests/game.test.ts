import { expect, test } from '@playwright/test';

test.describe('checker game', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('empty gameboard is shown with cells on it', async ({ page }) => {
		await expect(
			page.locator('.gameboard', { has: page.locator('.gameboard__cell') })
		).toBeVisible();
	});

	test('player count is constrained between 1-6', async ({ page }) => {
		await page.locator('[placeholder="玩家人數"]').fill('7');
		expect(
			parseInt(await page.locator('[placeholder="玩家人數"]').inputValue())
		).toBeLessThanOrEqual(6);
	});

	test('init marbles according to specified player count', async ({ page }) => {
		const playerCount = Math.floor(Math.random() * 6) + 1;
		await page.locator('[placeholder="玩家人數"]').fill(playerCount.toString());
		await page.locator('"初始化棋盤"').click();
		expect(await page.locator('.gameboard .gameboard__marble').count()).toBe(10 * playerCount);
	});

	test('show active team', async ({ page }) => {
		await page.locator('"初始化棋盤"').click();
		await expect(page.locator('"當前走子"')).toBeVisible();
		await expect(page.locator('.sidebar .gameboard__marble')).toBeVisible();
	});

	test('can select marble', async ({ page }) => {
		await page.locator('"初始化棋盤"').click();

		const marble = page.locator('.gameboard__marble[data-team="2"]').last();
		await marble.click();
		await expect(marble).toHaveClass(/gameboard__marble--selected/);
	});

	test('can only select marbles of the active team', async ({ page }) => {
		await page.locator('"初始化棋盤"').click();
		const marble = page.locator('.gameboard__marble[data-team="5"]').last();
		await marble.click();
		await expect(marble).not.toHaveClass(/gameboard__marble--selected/);
	});

	test('show movable locations for selected marble (adjacent moving)', async ({ page }) => {
		await page.locator('"初始化棋盤"').click();

		const marble = page.locator('.gameboard__marble[data-team="2"]').last();
		await marble.click();
		await expect(page.locator('.gameboard .gameboard__cell--hinted')).toHaveCount(2);
	});

	test('show movable locations for selected marble (jumping)', async ({ page }) => {
		await page.locator('"初始化棋盤"').click();

		const marble = page.locator('.gameboard__marble[data-team="2"]').nth(-3);
		await marble.click();
		await expect(page.locator('.gameboard .gameboard__cell--hinted')).toHaveCount(2);
	});

	test('can select movable locations', async ({ page }) => {
		await page.locator('"初始化棋盤"').click();
		await page.locator('.gameboard__marble[data-team="2"]').last().click();

		const cell = page.locator('.gameboard .gameboard__cell--hinted').first();
		await cell.click();
		await expect(cell).toHaveClass(/gameboard__cell--selected/);
	});
});
