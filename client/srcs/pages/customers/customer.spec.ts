
import { test, expect } from '@playwright/test';

test.describe('Customer Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5000/customers');
  });

  test('should not allow creating a customer with a duplicate phone number', async ({ page }) => {
    await page.click('button:has-text("Add Customer")');
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="phone"]', '1234567890');
    await page.fill('input[name="email"]', 'john.doe@example.com');
    await page.fill('input[name="address"]', '123 Main St');
    await page.click('button:has-text("Save")');

    await page.click('button:has-text("Add Customer")');
    await page.fill('input[name="name"]', 'Jane Doe');
    await page.fill('input[name="phone"]', '1234567890');
    await page.fill('input[name="email"]', 'jane.doe@example.com');
    await page.fill('input[name="address"]', '456 Oak Ave');
    await page.click('button:has-text("Save")');

    await expect(page.locator('text=Phone number already exists')).toBeVisible();
  });

  test('should filter projects by customer', async ({ page }) => {
    // First, create a customer to associate with projects
    await page.click('button:has-text("Add Customer")');
    await page.fill('input[name="name"]', 'Test Customer');
    await page.fill('input[name="phone"]', '9876543210');
    await page.fill('input[name="email"]', 'test.customer@example.com');
    await page.fill('input[name="address"]', '789 Pine St');
    await page.click('button:has-text("Save")');
    await page.waitForSelector('text=Test Customer');

    // Go to projects and create a project for this customer
    await page.goto('http://localhost:5000/projects');
    await page.click('button:has-text("Add Project")');
    await page.fill('input[name="name"]', 'Project for Test Customer');
    await page.selectOption('select[name="customerId"]', { label: 'Test Customer' });
    await page.click('button:has-text("Save")');
    await page.waitForSelector('text=Project for Test Customer');


    // Go back to customers and view projects for the customer
    await page.goto('http://localhost:5000/customers');
    await page.click('button:has-text("View Projects")');

    // Assert that only the customer's project is visible
    await expect(page.locator('text=Project for Test Customer')).toBeVisible();
    await expect(page.locator('text=Another Project')).not.toBeVisible();
  });
});
