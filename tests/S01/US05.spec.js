const { test, expect } = require('../Core/Core')
// import { generateNewResident } from '../../utils/account'

// const resident = generateNewResident()
// console.log(resident)

test.admin(
  'US5 [Admin to NOK] | Access NOK List',
  async ({ page }, testInfo) => {
    await test.admin.step('Go to Resident List', async () => {
      await page.goto('https://outtst.werkdone.com/NOKGateway_UI/Users')
    })

    await test.admin.step('Go to NOK Tab', async () => {
      await page.getByRole('tab', { name: 'NOK' }).click()
    })

    await test.admin.step(
      'Expect NOK table is displayed on the page',
      async () => {
        await expect(page.locator('table.table')).toBeVisible()
      }
    )
  }
)

test.admin(
  'US5 [Admin to NOK] | View NOK Profile',
  async ({ page }, testInfo) => {
    await test.admin.step('Go to Resident List', async () => {
      await page.goto('https://outtst.werkdone.com/NOKGateway_UI/Users')
    })

    await test.admin.step('Go to NOK Tab', async () => {
      await page.getByRole('tab', { name: 'NOK' }).click()
    })

    let nokName
    await test.admin.step('Click NOK Full Name', async () => {
      nokName = await page
        .locator('tbody tr td')
        .nth(0)
        .locator('a.nok-text-link-primary')
        .innerText()
      await page
        .locator('tbody tr td')
        .nth(0)
        .locator('a.nok-text-link-primary')
        .click()
    })
    console.log(nokName)

    await test.admin.step('Click NOK Full Name', async () => {
      await expect(page).toHaveTitle('NOKDetails')
      await expect(page.locator('#DetailsContainer')).toContainText(nokName)
    })
  }
)

test.admin(
  'US5 [Admin to NOK] | Search NOK Profiles',
  async ({ page }, testInfo) => {
    await test.admin.step('Go to Resident List', async () => {
      await page.goto('https://outtst.werkdone.com/NOKGateway_UI/Users')
    })

    await test.admin.step('Go to NOK Tab', async () => {
      await page.getByRole('tab', { name: 'NOK' }).click()
    })

    let nokName
    await test.admin.step('Click NOK Full Name', async () => {
      nokName = await page
        .locator('tbody tr td')
        .nth(0)
        .locator('a.nok-text-link-primary')
        .innerText()
      await page
        .locator('tbody tr td')
        .nth(0)
        .locator('a.nok-text-link-primary')
        .click()
    })

    await test.admin.step('Aplly filter by NOK Name', async () => {
      await page.getByPlaceholder('Search by Name').click()
      await page.getByPlaceholder('Search by Name').fill(nokName)
    })

    await test.admin.step('Expect NOK name appears on the list', async () => {
      await expect(page.getByRole('link', { name: nokName })).toBeVisible();
    })
  }
)

test.default(
  'US5 [Admin to NOK] | Role Authorization',
  async ({ page }, testInfo) => {
    await test.default.step('Go to Resident List', async () => {
      await page.goto(
        'https://outtst.werkdone.com/NOKGateway_UI/Users?UsersType=1'
      )
    })

    await test.default.step('Should be redirected to Login Page', async () => {
      await expect(page).toHaveTitle('Login')
    })
  }
)

test.admin(
  'US5 [Admin to NOK] | Incorrect Filter',
  async ({ page }, testInfo) => {
    await test.admin.step('Go to admin list', async () => {
      await page.goto('https://outtst.werkdone.com/NOKGateway_UI/Users')
    })

    await test.admin.step('Go to NOK Tab', async () => {
      await page.getByRole('tab', { name: 'NOK' }).click()
    })

    await test.admin.step('Applying search filter to the table list', async () => {
      await page.getByPlaceholder('Search by Name').click()
      await page.getByPlaceholder('Search by Name').fill('aaaaa')
    })

    await test.admin.step('Expect no records found', async () => {
      await expect(page.locator('#b11-NOKTab_Content')).toContainText('No records found...');
    })
  }
)