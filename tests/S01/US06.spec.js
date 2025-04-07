const { test, expect } = require('../Core/Core')
import { generateNewResident } from '../../utils/account'

const resident = generateNewResident()
console.log(resident)

test.admin(
  'US6 [Admin to NOK] | Access NOK Registration',
  async ({ page }, testInfo) => {
    await test.admin.step('Go to Resident List', async () => {
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
      }
    )

    await test.admin.step('Go to NOK Tab', async () => {
      await page.getByRole('radio', { name: 'NOK' }).click()
    })

    await test.admin.step('Registration popup should be appear', async () => {
      await page.getByRole('button', { name: 'Add NOK' }).click()
      await expect(page.locator('#b8-Header')).toContainText('NOK Registration')
      await page.getByRole('button', { name: 'Cancel' }).click()
    })
  }
)

test.admin(
  'US6 [Admin to NOK] | Fill NOK Details',
  async ({ page }, testInfo) => {
    await test.admin.step('Go to Resident List', async () => {
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
      }
    )

    await test.admin.step('Go to NOK Tab', async () => {
      await page.getByRole('radio', { name: 'NOK' }).click()
    })

    await test.admin.step('Registration popup should be appear', async () => {
      await page.getByRole('button', { name: 'Add NOK' }).click()
      await expect(page.locator('#b8-Header')).toContainText('NOK Registration')
    })

    await test.admin.step('Fill NOK Registration form', async () => {
      await page.getByPlaceholder('Name of NOK as in NRIC').click();
      await page.getByPlaceholder('Name of NOK as in NRIC').fill(resident.mainNOKFullName);
      await page.getByLabel('Relation to Resident').selectOption(resident.relation);
      await page.getByPlaceholder('4567').click();
      await page.getByPlaceholder('4567').fill(resident.NOKMobileNumber.number);
      await page.getByRole('button', { name: 'Submit' }).click();
    })

  }
)

test.admin(
  'US6 [Admin to NOK] | Mandatory Fields Check',
  async ({ page }, testInfo) => {
    await test.admin.step('Go to Resident List', async () => {
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
      }
    )

    await test.admin.step('Go to NOK Tab', async () => {
      await page.getByRole('radio', { name: 'NOK' }).click()
    })

    await test.admin.step('Registration popup should be appear', async () => {
      await page.getByRole('button', { name: 'Add NOK' }).click()
      await expect(page.locator('#b8-Header')).toContainText('NOK Registration')
    })
    
    await test.admin.step('Submit empty form', async () => {
      await page.getByRole('button', { name: 'Submit' }).click();
      await expect(page.locator('#b8-Input_FullName_DescribedBy')).toContainText('This field is required.');
      await expect(page.locator('#b8-Dropdown_RelationToResident_DescribedBy')).toContainText('This field is required.');
      await expect(page.locator('#b8-Input_MobileNumber_DescribedBy')).toContainText('This field is required.');
      await page.getByRole('button', { name: 'Cancel' }).click();
    })
  }
)

test.admin(
  'US6 [Admin to NOK] | Duplicate Entry Check',
  async ({ page }, testInfo) => {
    await test.admin.step('Go to Resident List', async () => {
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
      }
    )

    await test.admin.step('Go to NOK Tab', async () => {
      await page.getByRole('radio', { name: 'NOK' }).click()
    })

    await test.admin.step('Registration popup should be appear', async () => {
      await page.getByRole('button', { name: 'Add NOK' }).click()
      await expect(page.locator('#b8-Header')).toContainText('NOK Registration')
    })

    await test.admin.step('Fill NOK Registration form', async () => {
      await page.getByPlaceholder('Name of NOK as in NRIC').click();
      await page.getByPlaceholder('Name of NOK as in NRIC').fill(resident.mainNOKFullName);
      await page.getByLabel('Relation to Resident').selectOption(resident.relation);
      await page.getByPlaceholder('4567').click();
      await page.getByPlaceholder('4567').fill(resident.NOKMobileNumber.number);
      await page.getByRole('button', { name: 'Submit' }).click();
    })
  }
)

