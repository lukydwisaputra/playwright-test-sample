const { test, expect } = require('../Core/Core')
import { generateNewResident } from '../../utils/account'

const resident = generateNewResident()
console.log(resident)

test.admin(
  'US4 [Admin to Resident] | Access Edit Profile Page',
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
      }
    )

    await test.admin.step('Input form field should be visible', async () => {
      await page
        .locator('div')
        .filter({ hasText: /^Personal InformationEdit$/ })
        .getByRole('button')
        .click()
      await expect(
        page.getByPlaceholder('Name of resident as in NRIC')
      ).toBeVisible()
      await expect(page.getByLabel('Level')).toBeVisible()
    })
  }
)

test.admin(
  'US4 [Admin to Resident] | Edit and Save Senior Details',
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
      }
    )

    await test.admin.step('Input form field should be visible', async () => {
      await page
        .locator('div')
        .filter({ hasText: /^Personal InformationEdit$/ })
        .getByRole('button')
        .click()
      await expect(
        page.getByPlaceholder('Name of resident as in NRIC')
      ).toBeVisible()
      await expect(page.getByLabel('Level')).toBeVisible()
    })

    await test.admin.step('Input form field should be visible', async () => {
      await page.getByPlaceholder('Name of resident as in NRIC').click()
      await page
        .getByPlaceholder('Name of resident as in NRIC')
        .fill(resident.fullName)

      await page.getByLabel('Preferred Name').click()
      await page.getByLabel('Preferred Name').fill(resident.preferredName)

      await page.getByLabel('Gender').selectOption(resident.gender)

      await page.getByPlaceholder('e.g. 123A').click()
      await page.getByPlaceholder('e.g. 123A').fill(resident.NRIC)

      await page.locator('#b9-DatePicker_Dob').getByRole('textbox').click()
      // await page.getByRole('spinbutton', { name: 'Year' }).click();
      // await page.getByRole('spinbutton', { name: 'Year' }).fill('1974');
      // await wait(2_000)
      await page.getByLabel(resident.dateOfBirth).click()

      await page.getByLabel('Citizenship').selectOption(resident.citizenship)

      await page.getByLabel('Race').selectOption(resident.race)

      await page.getByLabel('Religion').selectOption(resident.religion)

      await page.getByText('Select language').click()
      await page
        .getByRole('option', { name: resident.language })
        .locator('span')
        .first()
        .click()

      await page.getByRole('textbox', { name: 'DD-MM-YYYY' }).click()
      await page.getByLabel(resident.dateOfRegistration).click()

      await page.getByLabel('Mobile Number').click()
      await page.getByLabel('Mobile Number').fill(resident.mobileNumber.number)

      await page.getByLabel('Home Phone Number').click()
      await page
        .getByLabel('Home Phone Number')
        .fill(resident.homePhoneNumber.number)

      await page.getByPlaceholder('Notes').click()
      await page.getByPlaceholder('Notes').fill(resident.remarks)
    })

    await test.admin.step('Fill Location Form', async () => {
      await page.getByLabel('Level').selectOption(resident.level)
      await page.getByLabel('Household').selectOption(resident.household)
      await page.getByLabel('Bed').selectOption(resident.bed)
      
      await page
      .locator('#FooterContent')
      .getByRole('button', { name: 'Next' })
      .click()
    })
    
    await test.admin.step('Save updated resident data ', async () => {
      await page
      .locator('#FooterContent')
      .getByRole('button', { name: 'Save' })
      .click()
    })

  }
)

test.admin(
  'US4 [Admin to Resident] | Cancel Edit',
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
      }
    )

    await test.admin.step('Input form field should be visible', async () => {
      await page
        .locator('div')
        .filter({ hasText: /^Personal InformationEdit$/ })
        .getByRole('button')
        .click()
      await expect(
        page.getByPlaceholder('Name of resident as in NRIC')
      ).toBeVisible()
      await expect(page.getByLabel('Level')).toBeVisible()
    })

    await test.admin.step('Input form field should be hidden', async () => {
      await page.getByRole('button', { name: 'Cancel' }).nth(1).click()
      await expect(
        page
          .locator('div')
          .filter({ hasText: /^Personal InformationEdit$/ })
          .getByRole('button')
      ).toBeVisible()
    })
  }
)
