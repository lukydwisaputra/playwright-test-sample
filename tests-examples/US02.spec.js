const { test, expect } = require('@playwright/test')
const { wait } = require('../utils/time')
require('dotenv').config()

let ADMIN_PHONE_NUMBER = process.env.ADMIN_PHONE_NUMBER

test('US-2: Open Registration Form', async ({ page }) => {
  // override test timeout
  test.setTimeout(60_000)

  // Login as an Admin
  await page.goto('/NOKGateway_UI/Login')
  await page.getByPlaceholder('e.g 8123').click()
  await page.getByPlaceholder('e.g 8123').fill(ADMIN_PHONE_NUMBER)
  await page.getByRole('button', { name: 'Login' }).click()
  let otp_element = await page.locator('#TEMPORARYFOROTP').textContent()

  do {
    otp_element = await page.locator('#TEMPORARYFOROTP').textContent()
  } while (otp_element?.length != 11)

  const otp_code = otp_element.slice(-6)
  expect(otp_code.length).toEqual(6)

  await page.getByPlaceholder('-digit OTP Code').click()
  await page.getByPlaceholder('-digit OTP Code').fill(otp_code)
  await page.getByRole('button', { name: 'Verify OTP' }).click()
  await expect(page.getByRole('banner')).toContainText('Admin 01')

  // Open Registration Form
  await page.goto('/NOKGateway_UI/Users')

  await page.getByRole('button', { name: 'Add Resident ' }).click()
  await expect(
    page.locator('span').filter({ hasText: 'Resident Registration' })
  ).toContainText('Resident Registration')

  // close page
  await page.close()
})
