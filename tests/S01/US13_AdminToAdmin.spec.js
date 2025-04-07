const { test, expect } = require('../Core/Core')
import { generateNewAdminStaff } from '../../utils/account'

const user = generateNewAdminStaff()
console.log({ admin: user })

test.admin('US13 [Admin to Admin] | Edit Admin/Staff Profile', async ({ page }, testInfo) => {
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

    await test.admin.step('Edit admin profile', async () => {
      await page.getByRole('button', { name: 'Edit' }).click();
      await expect(page.locator('#PopupRegisterAdmin')).toContainText('Edit Admin Registration');
      await expect(page.getByPlaceholder('Name of Admin as in NRIC')).toHaveValue(adminName);

      await page.getByPlaceholder('Name of Admin as in NRIC').click();
      await page.getByPlaceholder('Name of Admin as in NRIC').fill(user.fullName);

      let adminType = await page.getByLabel('Role').inputValue()
      // console.log(typeof(adminRole))
      await page.getByLabel('Role').selectOption(adminType == '0' ? '1' : '0');
      await page.getByPlaceholder('e.g. 8123').click();
      await page.getByPlaceholder('e.g. 8123').fill(user.mobileNumber.number);
      await page.getByPlaceholder('e.g. example@email.com').click();
      await page.getByPlaceholder('e.g. example@email.com').fill(user.email);
      await page.getByRole('button', { name: 'Submit' }).click();
      await expect(page.getByRole('alert')).toContainText('Admin details updated');
    })

    await test.admin.step('Expect admin profile has updated', async () => {
      await page.locator('#b1-MainContentWrapper i').nth(2).click();
      await page.getByPlaceholder('Search by Name').click();
      await page.getByPlaceholder('Search by Name').fill(adminName);
      await expect(page.locator('#b9-MainContainer')).toContainText('No records found...');
    })
  }
)

test.admin('US13 [Admin to Admin] | Missing Mandatory Fields', async ({ page }, testInfo) => {
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

    await test.admin.step('Edit admin profile', async () => {
      await page.getByRole('button', { name: 'Edit' }).click();
      await expect(page.locator('#PopupRegisterAdmin')).toContainText('Edit Admin Registration');
      await expect(page.getByPlaceholder('Name of Admin as in NRIC')).toHaveValue(adminName);

      await page.getByPlaceholder('Name of Admin as in NRIC').click();
      await page.getByPlaceholder('Name of Admin as in NRIC').fill('');

      await page.getByLabel('Role').selectOption('-1');
      await page.getByPlaceholder('e.g. 8123').click();
      await page.getByPlaceholder('e.g. 8123').fill('');
      await page.getByPlaceholder('e.g. example@email.com').click();
      await page.getByPlaceholder('e.g. example@email.com').fill('');
      await page.getByRole('button', { name: 'Submit' }).click();
    })

    await test.admin.step('Expect error empty mandatory field', async () => {
      await expect(page.getByRole('alert')).toContainText('Please complete the required fields before updating');
      await expect(page.locator('#FullNameInput_DescribedBy')).toContainText('This field is required.');
      await expect(page.locator('#Input_MobileNumber_DescribedBy')).toContainText('This field is required.');
      await expect(page.locator('#EmailInput_DescribedBy')).toContainText('This field is required.');
      await page.getByRole('button', { name: 'Cancel' }).click();
    })
  }
)
