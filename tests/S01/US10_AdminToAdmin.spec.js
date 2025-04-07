const { test, expect } = require('../Core/Core')

test.admin(
  'US10 [Admin to Admin] | View Admin/Staff List',
  async ({ page }, testInfo) => {
    await test.admin.step('Go to admin list', async () => {
      await page.goto('https://outtst.werkdone.com/NOKGateway_UI/AdminPortal')
    })

    await test.admin.step('Admin table should be visible', async () => {
      await expect(page.locator('table.table')).toBeVisible()
    })
  }
)

test.admin('US10 [Admin to Admin] | Pagination', async ({ page }, testInfo) => {
  await test.admin.step('Go to admin list', async () => {
    await page.goto('https://outtst.werkdone.com/NOKGateway_UI/AdminPortal')
  })

  await test.admin.step('Pagination should be visible', async () => {
    await expect(page.getByLabel('Pagination')).toBeVisible()
  })
})

test.admin('US10 [Admin to Admin] | Filtering', async ({ page }, testInfo) => {
  await test.admin.step('Go to admin list', async () => {
    await page.goto('https://outtst.werkdone.com/NOKGateway_UI/AdminPortal')
  })

  await test.admin.step('Filter Admin 01', async () => {
    await page.getByPlaceholder('Search by Name').click()
    await page.getByPlaceholder('Search by Name').fill('Admin 01')
    await page.locator('#b9-FilterRole').selectOption('0')
    await page.locator('#b9-FilterRoleStatus').selectOption('0')
    await expect(page.locator('tbody')).toContainText('Admin 01')
    await expect(page.locator('tbody')).toContainText('Admin')
    await expect(page.locator('tbody')).toContainText('Active')
  })
})

test.admin('US10 [Admin to Admin] | See Details Action', async ({ page }, testInfo) => {
  await test.admin.step('Go to admin list', async () => {
    await page.goto('https://outtst.werkdone.com/NOKGateway_UI/AdminPortal')
  })

  let adminName
  await test.admin.step('Expect redirected to Admin Details Page', async () => {
    adminName = await page.locator('tbody tr td').nth(0).innerText()
    await page.locator('tbody tr td').nth(6).locator('i.icon-fi-rr-eye').click()
  })

  await test.admin.step('Expect specific admin details', async () => {
    await expect(page).toHaveTitle('AdminStaffDetails')
    await expect(page.locator('#Session1')).toContainText(adminName)
  })
})

test.admin('US10 [Admin to Admin] | Delete Admin Action', async ({ page }, testInfo) => {
  await test.admin.step('Go to admin list', async () => {
    await page.goto('https://outtst.werkdone.com/NOKGateway_UI/AdminPortal')
  })

  let adminName
  await test.admin.step('Expect redirected to Admin Details Page', async () => {
    adminName = await page.locator('tbody tr td').nth(0).innerText()
    await page
      .locator('tbody tr td')
      .nth(6)
      .locator('i.icon-fi-rr-trash')
      .click()
  })

  await test.admin.step('Confirmation popup should appear', async () => {
    await expect(page.locator('#b9-PopupConfirm')).toContainText(
      'Delete Admin Profile'
    )
    await expect(page.locator('#b9-PopupConfirm')).toContainText(adminName)
  })

  await test.admin.step('Confirm admin deletion', async () => {
    await expect(page.locator('#b9-PopupConfirm')).toContainText(
      'Delete Admin Profile'
    )
    await expect(page.locator('#b9-PopupConfirm')).toContainText(adminName)
    await page.getByRole('button', { name: 'Confirm' }).click()
  })

  await test.admin.step('Expect admin was deleted from the list', async () => {
    await page.getByPlaceholder('Search by Name').click()
    await page.getByPlaceholder('Search by Name').fill(adminName)
    await expect(page.locator('#b9-MainContainer')).toContainText(
      'No records found...'
    )
  })
})

test.default(
  'US10 [Admin to Admin] | Role Authorization',
  async ({ page }, testInfo) => {
    await test.default.step('Go to admin list', async () => {
      await page.goto('https://outtst.werkdone.com/NOKGateway_UI/AdminPortal')
    })

    await test.default.step('Expect to redirected to Login page', async () => {
      await expect(page).toHaveTitle('Login')
      await page.close()
    })
  }
)

test.admin('US10 [Admin to Admin] | Incorrect Filter', async ({ page }, testInfo) => {
  await test.admin.step('Go to admin list', async () => {
    await page.goto('https://outtst.werkdone.com/NOKGateway_UI/AdminPortal')
  })

  await test.admin.step('Fill incorrect filter', async () => {
    await page.getByPlaceholder('Search by Name').click()
    await page.getByPlaceholder('Search by Name').fill('adminnotfound')
    await page.locator('#b9-FilterRole').selectOption('0')
    await page.locator('#b9-FilterRoleStatus').selectOption('0')

    await expect(page.locator('#b9-MainContainer')).toContainText(
      'No records found...'
    )
  })
})
