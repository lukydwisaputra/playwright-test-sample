const { test, expect } = require('../Core/Core')
import { generateNewAdminStaff } from '../../utils/account'

const user = generateNewAdminStaff()
console.log({ staff: user })

test.admin(
  'US11 [Admin to Staff] | Register New Admin/Staff',
  async ({ page }, testInfo) => {
    await test.admin.step('Go to staff list', async () => {
      await page.goto('https://outtst.werkdone.com/NOKGateway_UI/AdminPortal')
      await page.getByRole('tab', { name: 'Staff' }).click()
      await page.getByRole('button', { name: 'Add Staff' }).click()
    })

    await test.admin.step('Fill staff registration form', async () => {
      // Registration Popup
      await expect(page.locator('#b11-PopupRegisterStaff')).toContainText(
        'Staff Registration'
      )
      await page.getByPlaceholder('Name of Staff as in NRIC').click()
      await page
        .getByPlaceholder('Name of Staff as in NRIC')
        .fill(user.fullName)
      await page.getByPlaceholder('Input Staff ID').click()
      await page
        .getByPlaceholder('Input Staff ID')
        .fill(
          user.mobileNumber.number.toString() +
            user.mobileNumber.code.toString()
        )
      await page.getByLabel('Staff Type').selectOption('0')
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
        'New staff registered'
      )

      await expect(page.locator('#b11-PopupSuccess')).toContainText(
        'Registration Successful'
      )
    })

    await test.admin.step(
      'New staff should be listed on the Staff List table',
      async () => {
        // await page.getByRole('button', {name: "Add Admin"})
        await page.getByRole('button', { name: 'Back to Staff List' }).click()
        await page.getByPlaceholder('Search by Name').click()
        await page.getByPlaceholder('Search by Name').fill(user.fullName)
        await expect(page.locator('tbody')).toContainText(user.fullName)
        await expect(page.locator('tbody')).toContainText('Active')
      }
    )
  }
)

test.admin('US11 [Admin to Staff] | Incorrect Details', async ({ page }, testInfo) => {
  await test.admin.step('Go to staff list', async () => {
    await page.goto('https://outtst.werkdone.com/NOKGateway_UI/AdminPortal')
    await page.getByRole('tab', { name: 'Staff' }).click()
    await page.getByRole('button', { name: 'Add Staff' }).click()
  })

  // Registration Popup
  await test.admin.step('Submit empty staff registration form', async () => {
    await expect(page.locator('#b11-PopupRegisterStaff')).toContainText(
      'Staff Registration'
    )

    await page.getByRole('button', { name: 'Submit' }).click()
  })

  await test.admin.step('Expect error label for required field', async () => {
    await expect(page.locator('#b11-FullNameInput_DescribedBy')).toContainText(
      'This field is required.'
    )
    await expect(page.locator('#b11-StaffInput_DescribedBy')).toContainText(
      'This field is required.'
    )
    await expect(page.locator('#b11-DropdownRole_DescribedBy')).toContainText(
      'This field is required.'
    )
    await expect(
      page.locator('#b11-Input_MobileNumber_DescribedBy')
    ).toContainText('This field is required.')
    await expect(page.locator('#b11-EmailInput_DescribedBy')).toContainText(
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

test.admin('US11 [Admin to Staff] | Duplicate Entry', async ({ page }, testInfo) => {
  await test.admin.step('Go to staff list', async () => {
    await page.goto('https://outtst.werkdone.com/NOKGateway_UI/AdminPortal')
    await page.getByRole('tab', { name: 'Staff' }).click()
    await page.getByRole('button', { name: 'Add Staff' }).click()
  })

  await test.admin.step(
    'Fill staff registration form with duplicate data',
    async () => {
      // Registration Popup
      await expect(page.locator('#b11-PopupRegisterStaff')).toContainText(
        'Staff Registration'
      )
      await page.getByPlaceholder('Name of Staff as in NRIC').click()
      await page
        .getByPlaceholder('Name of Staff as in NRIC')
        .fill(user.fullName)
      await page.getByPlaceholder('Input Staff ID').click()
      await page
        .getByPlaceholder('Input Staff ID')
        .fill(
          user.mobileNumber.number.toString() +
            user.mobileNumber.code.toString()
        )
      await page.getByLabel('Staff Type').selectOption('0')
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
    await expect(page.locator('#b11-FormRegisterAdmin')).toContainText('This Staff already registered.');
    // await page.getByRole('button', {name: "Add Admin"})
    await page.getByRole('button', { name: 'Cancel' }).click()
  })
})
