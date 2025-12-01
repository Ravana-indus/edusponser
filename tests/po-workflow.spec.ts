import { test, expect } from '@playwright/test'

async function callApi(request: any, path: string, body?: any) {
  const res = await request.post(path, { data: body ?? {} })
  expect(res.ok()).toBeTruthy()
  return res.json()
}

test.describe('Purchase Order workflow', () => {
  test('approve and fulfill PO-2 via API', async ({ request }) => {
    // Approve PO-2
    const approved = await callApi(request, '/api/purchase-orders/PO-2/approve', { by: 'vendor@example.com' })
    expect(approved.status).toMatch(/approved/i)

    // Fulfill PO-2
    const fulfilled = await callApi(request, '/api/purchase-orders/PO-2/fulfill', { by: 'vendor@example.com' })
    expect(fulfilled.status).toMatch(/fulfilled/i)
  })
})
