import { test, expect } from '@playwright/test';

const loginUrl = 'https://www.saucedemo.com/';

async function login(page: Parameters<Parameters<typeof test>[1]>[0]['page'], username: string, password: string) {
  await page.goto(loginUrl);
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

test.describe('SauceDemo UI', () => {
  test('displays the page title and login logo text', async ({ page }) => {
    await page.goto(loginUrl);

    await expect(page).toHaveTitle('Swag Labs');
    await expect(page.locator('.login_logo')).toHaveText('Swag Labs');
  });

  test('displays username, password, and login controls', async ({ page }) => {
    await page.goto(loginUrl);

    await expect(page.getByPlaceholder('Username')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('displays the expected input placeholders', async ({ page }) => {
    await page.goto(loginUrl);

    await expect(page.locator('[data-test="username"]')).toHaveAttribute('placeholder', 'Username');
    await expect(page.locator('[data-test="password"]')).toHaveAttribute('placeholder', 'Password');
  });

  test('displays the app logo and shopping cart after login', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');

    await expect(page.locator('.app_logo')).toHaveText('Swag Labs');
    await expect(page.locator('[data-test="shopping-cart-link"]')).toBeVisible();
  });

  test('displays footer text on the inventory page', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');

    await expect(page.locator('.footer_copy')).toContainText('Sauce Labs. All Rights Reserved.');
  });
});

test.describe('SauceDemo functionality', () => {
  test('logs in successfully and redirects to the inventory page', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/\/inventory\.html$/);
  });

  test('shows a locked out error for locked_out_user', async ({ page }) => {
    await login(page, 'locked_out_user', 'secret_sauce');

    await expect(page.locator('[data-test="error"]')).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
  });

  test('shows an invalid credentials error for a wrong password', async ({ page }) => {
    await login(page, 'standard_user', 'wrong_password');

    await expect(page.locator('[data-test="error"]')).toHaveText(
      'Epic sadface: Username and password do not match any user in this service'
    );
  });

  test('updates the cart badge when an item is added', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

  test('logs out through the sidebar menu', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.locator('[data-test="logout-sidebar-link"]').click();

    await expect(page).toHaveURL(loginUrl);
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});