const { test, expect } = require('../Core/Core')

test.admin(
  'US10 [Admin to Staff] | View Admin/Staff List',
  async ({ page }, testInfo) => {
    await test.admin.step('Go to staff list', async () => {
      await page.goto('https://outtst.werkdone.com/NOKGateway_UI/AdminPortal')
      await page.getByRole('tab', { name: 'Staff' }).click()
    })

    await test.admin.step('Staff table should be visible', async () => {
      await expect(page.locator('table.table')).toBeVisible()
    })
  }
)

test.admin('US10 [Admin to Staff] | Pagination', async ({ page }, testInfo) => {
  await test.admin.step('Go to staff list', async () => {
    await page.goto('https://outtst.werkdone.com/NOKGateway_UI/AdminPortal')
    await page.getByRole('tab', { name: 'Staff' }).click()
  })

  await test.admin.step('Pagination should be visible', async () => {
    await expect(page.getByLabel('Pagination')).toBeVisible()
  })
})

test.admin('US10 [Admin to Staff] | Filtering', async ({ page }, testInfo) => {
  await test.admin.step('Go to staff list', async () => {
    await page.goto('https://outtst.werkdone.com/NOKGateway_UI/AdminPortal')
    await page.getByRole('tab', { name: 'Staff' }).click()
  })

  await test.admin.step('Filter Staff 01', async () => {
    await page.getByPlaceholder('Search by Name').click()
    await page.getByPlaceholder('Search by Name').fill('Staff 01')
    await page.locator('#b11-FilterRole').selectOption('0')
    await page.locator('#b11-FilterRoleStatus').selectOption('0')
    await expect(page.locator('tbody')).toContainText('Staff 01')
    await expect(page.locator('tbody')).toContainText('Staff')
    await expect(page.locator('tbody')).toContainText('Active')
  })
})

test.admin('US10 [Admin to Staff] | See Details Action', async ({ page }, testInfo) => {
  await test.admin.step('Go to staff list', async () => {
    await page.goto('https://outtst.werkdone.com/NOKGateway_UI/AdminPortal')
    await page.getByRole('tab', { name: 'Staff' }).click()
  })

  let staffName
  await test.admin.step('Expect redirected to Staff Details Page', async () => {
    staffName = await page.locator('tbody tr td').nth(0).innerText()
    await page.locator('tbody tr td').nth(7).locator('i.icon-fi-rr-eye').click()
  })

  await test.admin.step('Expect specific staff details', async () => {
    await expect(page).toHaveTitle('AdminStaffDetails')
    await expect(page.locator('#Session1')).toContainText(staffName)
  })
})

test.admin('US10 [Admin to Staff] | Delete Staff Action', async ({ page }, testInfo) => {
  await test.admin.step('Go to staff list', async () => {
    await page.goto('https://outtst.werkdone.com/NOKGateway_UI/AdminPortal')
    await page.getByRole('tab', { name: 'Staff' }).click()
  })

  let staffName
  await test.admin.step('Expect redirected to Staff Details Page', async () => {
    staffName = await page.locator('tbody tr td').nth(0).innerText()
    await page
      .locator('tbody tr td')
      .nth(7)
      .locator('i.icon-fi-rr-trash')
      .click()
  })

  await test.admin.step('Confirmation popup should appear', async () => {
    await expect(page.locator('#b11-PopupConfirm')).toContainText(
      'Delete Staff Profile'
    )
    await expect(page.locator('#b11-PopupConfirm')).toContainText(staffName)
  })

  await test.admin.step('Confirm staff deletion', async () => {
    await expect(page.locator('#b11-PopupConfirm')).toContainText(
      'Delete Staff Profile'
    )
    await expect(page.locator('#b11-PopupConfirm')).toContainText(staffName)
    await page.getByRole('button', { name: 'Confirm' }).click()
  })

  await test.admin.step('Expect staff was deleted from the list', async () => {
    await page.getByPlaceholder('Search by Name').click()
    await page.getByPlaceholder('Search by Name').fill(staffName)
    await expect(page.locator('#b11-MainContainer')).toContainText(
      'No records found...'
    )
  })
})

test.default(
  'US10 [Admin to Staff] | Role Authorization',
  async ({ page }, testInfo) => {
    await test.default.step('Go to staff list', async () => {
      await page.goto('https://outtst.werkdone.com/NOKGateway_UI/AdminPortal')
      await page.getByRole('tab', { name: 'Staff' }).click()
    })

    await test.default.step('Expect to redirected to Login page', async () => {
      await expect(page).toHaveTitle('Login')
      await page.close()
    })
  }
)

test.admin('US10 [Admin to Staff] | Incorrect Filter', async ({ page }, testInfo) => {
  await test.admin.step('Go to staff list', async () => {
    await page.goto('https://outtst.werkdone.com/NOKGateway_UI/AdminPortal')
    await page.getByRole('tab', { name: 'Staff' }).click()
  })

  await test.admin.step('Fill incorrect filter', async () => {
    await page.getByPlaceholder('Search by Name').click()
    await page.getByPlaceholder('Search by Name').fill('staffnotfound')
    await page.locator('#b11-FilterRole').selectOption('0')
    await page.locator('#b11-FilterRoleStatus').selectOption('0')

    await expect(page.locator('#b11-MainContainer')).toContainText(
      'No records found...'
    )
  })
})
