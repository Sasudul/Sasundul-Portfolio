# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\portfolio.spec.ts >> Portfolio loads and AI Chatbot functions
- Location: tests\portfolio.spec.ts:3:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('h2')
Expected substring: "Sasundul Wanasinghe"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('h2')

```

```yaml
- text: C O D E B Y S A S U N D U L ® 100 C O D E B Y S A S U N D U L ® 100
- button "Toggle menu"
- complementary:
  - link "WhatsApp":
    - /url: https://wa.me/+94740629020
    - img
    - text: WhatsApp
  - link "LinkedIn":
    - /url: https://www.linkedin.com/in/sasundul/
    - img
    - text: LinkedIn
  - link "GitHub":
    - /url: https://github.com/Sasudul
    - img
    - text: GitHub
  - button "Email Me":
    - img
    - text: Email Me
- button "Get CV"
- button "Talk to Sasa":
  - img "Sasa Avatar"
  - text: Talk to Sasa
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('Portfolio loads and AI Chatbot functions', async ({ page }) => {
  4  |     await page.goto('http://localhost:3000');
  5  | 
  6  |     // Check Hero title
> 7  |     await expect(page.locator('h2')).toContainText('Sasundul Wanasinghe');
     |                                      ^ Error: expect(locator).toContainText(expected) failed
  8  | 
  9  |     // Check CV button on bottom-left
  10 |     const cvButton = page.locator('button:has-text("Get CV")');
  11 |     await expect(cvButton).toBeVisible();
  12 | 
  13 |     // Open AI Chatbot
  14 |     const orb = page.locator('.ai-orb');
  15 |     await orb.click();
  16 |     await expect(page.locator('.ai-panel')).toBeVisible();
  17 | 
  18 |     // Send message
  19 |     await page.locator('.ai-input-bar__field').fill('What is your tech stack?');
  20 |     await page.locator('.ai-input-bar__send').click();
  21 |     await expect(page.locator('.ai-msg--user')).toContainText('What is your tech stack?');
  22 | });
  23 | 
```