import { test, expect } from '@playwright/test'

test('home page renders', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/EduSponsor/i)
})

test('login page loads', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByLabel('Username or Email')).toBeVisible()
})
