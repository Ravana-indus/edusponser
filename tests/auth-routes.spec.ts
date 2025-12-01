import { test, expect } from '@playwright/test'

const users = [
  { email: 'student@example.com', password: 'password', role: 'student', path: '/student/dashboard' },
  { email: 'donor@example.com', password: 'password', role: 'donor', path: '/donor/dashboard' },
]

test.describe('Auth redirects', () => {
  for (const u of users) {
    test(`login redirect: ${u.role}`, async ({ page }) => {
      await page.goto('/login')
      await page.getByLabel(/username or email/i).fill(u.email)
      await page.getByLabel(/password/i).fill(u.password)
      await page.getByRole('button', { name: /sign in/i }).click()
      await page.waitForURL('**' + u.path)
      await expect(page).toHaveURL(new RegExp(u.path))
    })
  }
})
