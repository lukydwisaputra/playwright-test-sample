const { test, expect } = require('../Core/Core')

test.admin(
  'US1 [Admin to Resident] | View Senior List',
  async ({ page }, testInfo) => {
    await test.admin.step('Go to admin list', async () => {
      await page.goto('https://outtst.werkdone.com/NOKGateway_UI/Users')
    })

    await test.admin.step('Admin table should be visible', async () => {
      await expect(page.locator('table.table')).toBeVisible()
    })
  }
)

test.admin(
  'US1 [Admin to Resident] | Pagination',
  async ({ page }, testInfo) => {
    await test.admin.step('Go to admin list', async () => {
      await page.goto('https://outtst.werkdone.com/NOKGateway_UI/Users')
    })

    await test.admin.step('Admin table should be visible', async () => {
      await expect(page.getByLabel('Pagination')).toBeVisible()
    })
  }
)

test.admin(
  'US1 [Admin to Resident] | Filtering',
  async ({ page }, testInfo) => {
    await test.admin.step('Go to admin list', async () => {
      await page.goto('https://outtst.werkdone.com/NOKGateway_UI/Users')
    })

    await test.admin.step('Applying filter to the table list', async () => {
      await page.getByPlaceholder('Search by Name').click()
      await page.getByPlaceholder('Search by Name').fill('Resident 01')
      await page.locator('#b9-Dropdown_FilterAgeGroup').selectOption('2')
      await page.locator('#b9-Dropdown_FilterMobility').selectOption('0')
    })

    await test.admin.step('Expect table show filtered record', async () => {
      await expect(page.locator('tbody')).toContainText('Resident 01')
    })
  }
)

test.admin(
  'US1 [Admin to Resident] | View Details Action',
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
        await expect(page.locator('tbody')).toContainText(residentName)
      }
    )
  }
)

// test.admin(
//   'US1 [Admin to Resident] | Discharge Action',
//   async ({ page }, testInfo) => {
//     await test.admin.step('Go to admin list', async () => {
//       // PENDING: FUNCTION NOT IMPLEMENTED YET
//     })
//   }
// )

test.admin(
  'US1 [Admin to Resident] | Delete Senior Profile Action',
  async ({ page }, testInfo) => {
    await test.admin.step('Go to admin list', async () => {
      await page.goto('https://outtst.werkdone.com/NOKGateway_UI/Users')
    })

    let residentName
    await test.admin.step('Go to admin list', async () => {
      residentName = await page
        .locator('tbody tr td')
        .nth(0)
        .locator('a.nok-text-link-primary')
        .innerText()
      await page
        .locator('tbody tr td')
        .nth(8)
        .locator('i.icon-fi-rr-trash')
        .click()
    })

    await test.admin.step(
      'Delete confirmation popup should appear',
      async () => {
        await expect(page.getByRole('heading')).toContainText(
          'Delete Resident Profile'
        )
        await expect(page.locator('#b9-Modal_DeleteResident')).toContainText(
          residentName
        )
      }
    )

    await test.admin.step('Delete selected resident', async () => {
      await page.getByRole('button', { name: 'Delete' }).click()
      await expect(page.getByRole('alert')).toContainText(
        'Record success message'
      )
    })

    await test.admin.step(
      'Search deleted resident on Resident List',
      async () => {
        await page.getByPlaceholder('Search by Name').click()
        await page.getByPlaceholder('Search by Name').fill(residentName)
      }
    )

    await test.admin.step(
      'Expect empty records shown on the list',
      async () => {
        await expect(page.locator('#b9-ResidentTab_Content')).toContainText(
          'No records found...'
        )
      }
    )
  }
)

test.default(
  'US1 [Admin to Resident] | Role Authorization',
  async ({ page }, testInfo) => {
    await test.default.step('Go to admin list', async () => {
      await page.goto('https://outtst.werkdone.com/NOKGateway_UI/Users')
    })

    await test.default.step('Expect to redirected to Login page', async () => {
      await expect(page).toHaveTitle('Login')
      await page.close()
    })
  }
)

test.admin(
  'US1 [Admin to Resident] | No Record Found on Search Name Filter',
  async ({ page }, testInfo) => {
    await test.admin.step('Go to admin list', async () => {
      await page.goto('https://outtst.werkdone.com/NOKGateway_UI/Users')
    })

    await test.admin.step(
      'Applying search filter to the table list',
      async () => {
        await page.getByPlaceholder('Search by Name').click()
        await page.getByPlaceholder('Search by Name').fill('Resident 01')
      }
    )

    await test.admin.step('Expect table show filtered record', async () => {
      await expect(page.locator('tbody')).toContainText('Resident 01')
    })
  }
)
