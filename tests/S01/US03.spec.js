const { test, expect } = require('../Core/Core')

test.admin(
  'US3 [Admin to Resident] | Access Senior Profile',
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
      'Should be redirected to Resident Details Page [Eye Icon Click]',
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

    await test.admin.step('Go to admin list again', async () => {
      await page.goto('https://outtst.werkdone.com/NOKGateway_UI/Users')
    })

    await test.admin.step('Click Resident Name', async () => {
      await page.getByRole('link', { name: residentName }).click()
    })

    await test.admin.step(
      'Should be redirected to Resident Details Page [Full Name Click]',
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
  }
)

test.admin(
  'US3 [Admin to Resident] | View NOK List',
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
        await expect(page.locator('table')).toBeVisible()
      }
    )
  }
)

test.admin(
  'US3 [Admin to Resident] | Navigation Back to Senior List',
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

    await test.admin.step('Go back to Resident List Page', async () => {
      await page.locator('#b1-MainContentWrapper i').nth(2).click()
    })

    await test.admin.step(
      'Should be redirected to Resident List Page',
      async () => {
        await expect(page).toHaveTitle('Users')
      }
    )
  }
)
