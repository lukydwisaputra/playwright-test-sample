const { test, expect } = require('../Core/Core')
import { generateNewResident } from '../../utils/account'

const resident = generateNewResident()

test.admin(
  'US8 [Admin to NOK] | Access Edit NOK Profile',
  async ({ page }, testInfo) => {
    await test.admin.step('Go to admin list', async () => {
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

    await test.admin.step('Click NOK Full Name', async () => {
      await expect(page).toHaveTitle('NOKDetails')
      await expect(page.locator('#DetailsContainer')).toContainText(nokName)
    })

    await test.admin.step('Click Edit button', async () => {
      await page.getByRole('button', { name: 'Edit' }).click()
    })

    await test.admin.step('Edit popup form should be appear', async () => {
      await expect(page.locator('#EditPopup')).toBeVisible()
      await page.getByRole('button', { name: 'Cancel' }).click()
    })
  }
)

test.admin(
  'US8 [Admin to NOK] | Update NOK Details',
  async ({ page }, testInfo) => {
    await test.admin.step('Go to admin list', async () => {
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

    await test.admin.step('Click NOK Full Name', async () => {
      await expect(page).toHaveTitle('NOKDetails')
      await expect(page.locator('#DetailsContainer')).toContainText(nokName)
    })

    await test.admin.step('Click Edit button', async () => {
      await page.getByRole('button', { name: 'Edit' }).click()
    })

    await test.admin.step('Edit popup form should be appear', async () => {
      await expect(page.locator('#EditPopup')).toBeVisible()
    })

    await test.admin.step('Fill edit popup form', async () => {
      // await page.getByLabel('Full Name').click()
      // await page.getByLabel('Full Name').fill(resident.nokFullName)
      await page.getByPlaceholder('4567').click()
      await page.getByPlaceholder('4567').fill(resident.NOKMobileNumber.number)
      await page.getByRole('button', { name: 'Save' }).click()

      await expect(page.locator('#MobileNumber')).toContainText(
        resident.NOKMobileNumber.number
      )
    })
  }
)
