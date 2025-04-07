const { test, expect } = require('../Core/Core')

test.admin(
  'US7 [Admin to NOK] | View NOK Profile',
  async ({ page }, testInfo) => {
    await test.admin.step('Go to admin list', async () => {
      await page.goto('https://outtst.werkdone.com/NOKGateway_UI/Users')
    })

    let residentName
    await test.admin.step('Click View Details Action', async () => {
      residentName = await page
        .locator('tbody tr td')
        .nth(0)
        .locator('a.nok-text-link-primary')
        .innerText()
      await page
        .locator('tbody tr td')
        .nth(8)
        .locator('i.icon-fi-rr-eye')
        .click()
    })

    await test.admin.step(
      'Should be redirected to Resident Details Page',
      async () => {
        await expect(page).toHaveTitle('ResidentDetails')
        await expect(page.locator('#HeaderUserCard')).toContainText(
          residentName
        )
        await expect(page.locator('#b7-FullNameContainer')).toContainText(
          residentName
        )
      }
    )

    await test.admin.step('Go to NOK Tab', async () => {
      await page.getByRole('radio', { name: 'NOK' }).click()
    })

    await test.admin.step(
      'Should be redirected to NOK Details page',
      async () => {
        await page
        .locator('tbody tr td')
        .nth(8)
        .locator('i.icon-fi-rr-eye')
        .click()
        await expect(page).toHaveTitle('NOKDetails')
      }
    )
  }
)
