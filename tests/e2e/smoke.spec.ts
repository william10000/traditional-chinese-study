import { test, expect } from '@playwright/test';

test.describe('Smoke', () => {
  test('loads home and shows flashcard section', async ({ page }) => {
    await page.goto('/');
    // Title and main header visible
    await expect(page.getByRole('heading', { name: /Traditional Chinese Learning/i })).toBeVisible();

    // Ensure a flashcard is present
    await expect(page.getByTestId('flashcard-section')).toBeVisible();
    await expect(page.getByTestId('flashcard-card')).toBeVisible();
    await expect(page.getByTestId('flashcard-character')).toBeVisible();
  });
});


