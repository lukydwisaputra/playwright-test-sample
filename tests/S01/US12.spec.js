const { test, expect } = require('../Core/Core')

test.admin(
  'US12 [Admin to Staff] | View Staff Profile',
  async ({ page }, testInfo) => {
    await test.admin.step('Go to staff list', async () => {
      await page.goto('https://outtst.werkdone.com/NOKGateway_UI/AdminPortal')
      await page.getByRole('tab', { name: 'Staff' }).click()
    })

    let staffName
    await test.admin.step('Click staff name on the table list', async () => {
      staffName = await page.locator('tbody tr td').nth(0).innerText()
      await page.getByText(staffName).click()
    })

    await test.admin.step(
      '[Click Staff Name] Should be redirected to Staff Profile Page',
      async () => {
        await expect(page).toHaveTitle('AdminStaffDetails')
        await expect(page.locator('#Session1')).toContainText(staffName)
      }
    )

    await test.admin.step('Click see details action on the table', async () => {
      staffName = await page.locator('tbody tr td').nth(0).innerText()
      await page
        .locator('tbody tr td')
        .nth(7)
        .locator('i.icon-fi-rr-eye')
        .click()
    })

    await test.admin.step(
      '[Click See Details Action] Should be redirected to Staff Profile Page',
      async () => {
        await expect(page).toHaveTitle('AdminStaffDetails')
        await expect(page.locator('#Session1')).toContainText(staffName)
      }
    )
  }
)
