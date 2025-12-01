import { test, expect } from '@playwright/test'

async function login(page, email: string, password: string) {
  await page.goto('/login')
  await page.getByLabel(/username or email/i).fill(email)
  await page.getByLabel(/password/i).fill(password)
  await page.getByRole('button', { name: /sign in/i }).click()
}

test('student can create an update', async ({ page }) => {
  await login(page, 'student@example.com', 'password')
  await page.waitForURL('**/student/dashboard')

  // open dialog
  await page.getByRole('button', { name: /new update/i }).click()

  // fill form
  await page.getByLabel(/title/i).fill('My Progress')
  await page.getByLabel(/type/i).selectOption('academic')
  await page.getByLabel(/content/i).fill('Made great progress this week.')

  // submit
  await page.getByRole('button', { name: /create update/i }).click()

  // verify appears in the list (latest updates section)
  await expect(page.getByText('My Progress')).toBeVisible()
})
