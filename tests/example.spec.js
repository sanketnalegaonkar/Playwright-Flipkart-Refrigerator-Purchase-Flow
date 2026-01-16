const { test, expect } = require('@playwright/test');

test('Flipkart Refrigerator Purchase Flow', async ({ page }) => {

  // 1. Open Flipkart
  await page.goto('https://www.flipkart.com/', { waitUntil: 'domcontentloaded' });

  // 2. Close login modal
  const closeBtn = page.locator('button._2KpZ6l._2doB4z');
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
  }

  // 3. Search for LG Refrigerators
  await page.locator('input[name="q"]').fill('LG Refrigerators');
  await page.keyboard.press('Enter');

  await page.waitForLoadState('networkidle');

  // 4. Apply Brand filters
  await page.locator('label:has-text("LG")').click();
  await page.locator('label:has-text("Samsung")').click();
  await page.locator('label:has-text("IFB")').click();

  await page.waitForLoadState('networkidle');

  // 5. Sort by Price: Low to High
  await page.locator('text=Price -- Low to High').click();

  // 6. Click on specific product
  const productName = 'LG 185 L Direct Cool Single Door 2 Star Refrigerator';
  await page.locator(`a:has-text("${productName}")`).first().click();

  // Handle new tab
  const productPage = await page.context().waitForEvent('page');
  await productPage.waitForLoadState();

  // 7. Verify product details page
  await expect(productPage.locator('span:has-text("LG 185 L")')).toBeVisible();

  // 8. Add to cart (handle strict mode)
  await productPage
  .locator('button:has-text("Add to cart"):not([disabled])')
  .click();


  // 9. Verify cart page
  await productPage.waitForURL('**/viewcart**');

  // 10. Increase quantity to 3
  await productPage.locator('button:has-text("+")').click();
  await productPage.locator('button:has-text("+")').click();

  // 11. Verify total amount is visible
  await productPage.waitForLoadState('networkidle');

  const totalAmount = productPage
  .locator('text=Total Amount')
  .locator('xpath=following::span[contains(text(),"₹")]')
  .first();

  await expect(totalAmount).toBeVisible();


  // 12. Place Order
  await productPage.locator('text=Place Order').click();

});
