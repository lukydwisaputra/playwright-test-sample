const { test, expect } = require('../Core/Core')
import { generateNewAdminStaff } from '../../utils/account'

const user = generateNewAdminStaff()
console.log({ admin: user })

test.admin(
  'US11 [Admin to Admin] | Register New Admin/Staff',
  async ({ page }, testInfo) => {
    await test.admin.step('Go to admin list', async () => {
      await page.goto('https://outtst.werkdone.com/NOKGateway_UI/AdminPortal')
      await page.getByRole('button', { name: 'Add Admin' }).click()
    })

    await test.admin.step('Fill admin registration form', async () => {
      // Registration Popup
      await expect(page.locator('#b9-PopupRegisterAdmin')).toContainText(
        'Admin Registration'
      )

      await page.getByPlaceholder('Name of Admin as in NRIC').click()
      await page
        .getByPlaceholder('Name of Admin as in NRIC')
        .fill(user.fullName)
      await page.getByLabel('Role').selectOption('0')
      await page.getByPlaceholder('e.g. 8123').click()
      await page
        .getByPlaceholder('e.g. 8123')
        .fill(user.mobileNumber.number.toString())
      await page.getByPlaceholder('e.g. example@email.com').click()
      await page.getByPlaceholder('e.g. example@email.com').fill(user.email)
      await page.getByRole('button', { name: 'Submit' }).click()
    })

    await test.admin.step('Expect Success Popup', async () => {
      // Success Popup
      await expect(page.getByRole('alert')).toContainText(
        'New admin registered'
      )
      await expect(page.locator('#b9-PopupSuccess')).toContainText(
        'Registration Successful'
      )
    })

    await test.admin.step(
      'New Admin should be listed on the Admin List table',
      async () => {
        // await page.getByRole('button', {name: "Add Admin"})
        await page.getByRole('button', { name: 'Back to Admin List' }).click()
        await page.getByPlaceholder('Search by Name').click()
        await page.getByPlaceholder('Search by Name').fill(user.fullName)
        await expect(page.locator('tbody')).toContainText(user.fullName)
        await expect(page.locator('tbody')).toContainText('Active')
      }
    )
  }
)

test.admin('US11 [Admin to Admin] | Incorrect Details', async ({ page }, testInfo) => {
  await test.admin.step('Go to admin list', async () => {
    await page.goto('https://outtst.werkdone.com/NOKGateway_UI/AdminPortal')
    await page.getByRole('button', { name: 'Add Admin' }).click()
  })

  // Registration Popup
  await test.admin.step('Submit empty admin registration form', async () => {
    await expect(page.locator('#b9-PopupRegisterAdmin')).toContainText(
      'Admin Registration'
    )

    await page.getByRole('button', { name: 'Submit' }).click()
  })

  await test.admin.step('Expect error label for required field', async () => {
    await expect(page.locator('#b9-FullNameInput_DescribedBy')).toContainText(
      'This field is required.'
    )
    await expect(page.locator('#b9-DropdownRole_DescribedBy')).toContainText(
      'This field is required.'
    )
    await expect(
      page.locator('#b9-Input_MobileNumber_DescribedBy')
    ).toContainText('This field is required.')
    await expect(page.locator('#b9-EmailInput_DescribedBy')).toContainText(
      'This field is required.'
    )
  })

  await test.admin.step('Expect alert to fill required field', async () => {
    await expect(page.getByRole('alert')).toContainText(
      'Please complete the required fields before updating'
    )
    await page.getByRole('button', { name: 'Cancel' }).click()
  })
})

test.admin('US11 [Admin to Admin] | Duplicate Entry', async ({ page }, testInfo) => {
  await test.admin.step('Go to admin list', async () => {
    await page.goto('https://outtst.werkdone.com/NOKGateway_UI/AdminPortal')
    await page.getByRole('button', { name: 'Add Admin' }).click()
  })

  await test.admin.step(
    'Fill admin registration form with duplicate data',
    async () => {
      // Registration Popup
      await expect(page.locator('#b9-PopupRegisterAdmin')).toContainText(
        'Admin Registration'
      )

      await page.getByPlaceholder('Name of Admin as in NRIC').click()
      await page
        .getByPlaceholder('Name of Admin as in NRIC')
        .fill(user.fullName)
      await page.getByLabel('Role').selectOption('0')
      await page.getByPlaceholder('e.g. 8123').click()
      await page
        .getByPlaceholder('e.g. 8123')
        .fill(user.mobileNumber.number.toString())
      await page.getByPlaceholder('e.g. example@email.com').click()
      await page.getByPlaceholder('e.g. example@email.com').fill(user.email)
      await page.getByRole('button', { name: 'Submit' }).click()
    }
  )

  await test.admin.step('Expect duplicate entry alert', async () => {
    await expect(page.locator('#b9-FormRegisterAdmin')).toContainText(
      'This admin already registered.'
    )
    // await page.getByRole('button', {name: "Add Admin"})
    await page.getByRole('button', { name: 'Cancel' }).click()
  })
})
