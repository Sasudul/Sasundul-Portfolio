import { test, expect } from '@playwright/test';

test('Portfolio loads and AI Chatbot functions', async ({ page }) => {
  await page.goto('/');

  // Check Hero title
  await expect(page.locator('h2')).toContainText('Sasundul Wanasinghe');

  // Check CV button on bottom-left
  const cvButton = page.locator('button:has-text("Get CV")');
  await expect(cvButton).toBeVisible();

  // Open AI Chatbot
  const orb = page.locator('.ai-orb');
  await expect(orb).toBeVisible();
  await orb.click();
  await expect(page.locator('.ai-panel')).toBeVisible();

  // Send message
  await page.locator('.ai-input-bar__field').fill('What is your tech stack?');
  await page.locator('.ai-input-bar__send').click();
  await expect(page.locator('.ai-msg--user')).toContainText('What is your tech stack?');
});
