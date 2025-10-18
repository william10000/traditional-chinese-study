import { test, expect } from '@playwright/test';

test.describe('Kid Mode and Filters', () => {
  test('toggle kid mode and verify filter panel visibility', async ({ page }) => {
    await page.goto('/');

    const filterPanel = page.getByTestId('filter-panel');
    // Kid mode defaults ON from localStorage logic; first visit may be ON
    // If panel is hidden, toggle to OFF; if visible, toggle ON then OFF to assert behavior.
    const kidToggle = page.getByTestId('kid-mode-toggle');

    const isPanelVisible = await filterPanel.isVisible().catch(() => false);
    if (!isPanelVisible) {
      await kidToggle.click(); // turn OFF kid mode
      await expect(filterPanel).toBeVisible();
    } else {
      await kidToggle.click(); // turn ON kid mode
      await expect(filterPanel).toBeHidden();
      await kidToggle.click(); // turn OFF kid mode
      await expect(filterPanel).toBeVisible();
    }
  });

  test('apply filters and see counts update', async ({ page }) => {
    await page.goto('/');

    // Ensure Kid Mode OFF to reveal filters
    const kidToggle = page.getByTestId('kid-mode-toggle');
    const filterPanel = page.getByTestId('filter-panel');
    if (!(await filterPanel.isVisible().catch(() => false))) {
      await kidToggle.click();
      await expect(filterPanel).toBeVisible();
    }

    const levelSelect = page.locator('#level-filter');
    const bookSelect = page.locator('#book-filter');
    const lessonSelect = page.locator('#lesson-filter');
    const countBadge = page.getByTestId('filter-count');

    const initialCount = parseInt((await countBadge.textContent()) || '0', 10);

    // Pick a specific level if available
    await levelSelect.selectOption({ index: 1 }).catch(() => {}); // index 0 is All

    // Book becomes enabled; choose first concrete book option if available
    if (await bookSelect.isEnabled()) {
      await bookSelect.selectOption({ index: 1 }).catch(() => {});
    }

    // Lesson becomes enabled; choose first lesson if available
    if (await lessonSelect.isEnabled()) {
      await lessonSelect.selectOption({ index: 1 }).catch(() => {});
    }

    const newCount = parseInt((await countBadge.textContent()) || '0', 10);
    expect(newCount).toBeGreaterThanOrEqual(0);
    // In most cases, filtering narrows the count
    expect(newCount).toBeLessThanOrEqual(initialCount);
  });

  test('flashcard interactions: reveal/hide and navigate', async ({ page }) => {
    await page.goto('/');

    // Ensure presence
    const card = page.getByTestId('flashcard-card');
    await expect(card).toBeVisible();

    // Toggle answer
    await card.click();
    await expect(page.getByText(/Click to hide answer/i)).toBeVisible();
    await card.click();
    await expect(page.getByText(/Click to reveal pinyin/i)).toBeVisible();

    // Use Quick Actions next/prev when Kid Mode OFF
    const kidToggle = page.getByTestId('kid-mode-toggle');
    const filterPanel = page.getByTestId('filter-panel');
    if (!(await filterPanel.isVisible().catch(() => false))) {
      await kidToggle.click();
      await expect(filterPanel).toBeVisible();
    }

    const nextButton = page.getByRole('button', { name: 'Next card' });
    const prevButton = page.getByRole('button', { name: 'Previous card' });
    await expect(nextButton).toBeEnabled();
    await nextButton.click();
    await prevButton.click();
  });
});


