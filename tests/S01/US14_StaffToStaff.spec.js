import { test, expect, devices } from '@playwright/test'
import { wait } from '../../utils/time'
require('dotenv').config()

// STAFF or NOK
const STAFF_PHONE_NUMBER = process.env.STAFF_PHONE_NUMBER
const STAFF_BASE_URL = process.env.STAFF_BASE_URL

test.use({
  ...devices['iPhone 13'],
  isMobile: true,
})

test('US14 [NOK to NOK] | Access My Profile', async ({ page }, testInfo) => {
  // LOGIN
  await test.step('Input Mobile Number', async () => {
    // go to Admin login page
    await page.goto(STAFF_BASE_URL)
    await page.locator('#Input_MobileNumber').click()
    await page.locator('#Input_MobileNumber').fill(STAFF_PHONE_NUMBER)
  })

  await test.step('Click Login Button', async () => {
    await page.getByRole('button', { name: 'Login' }).click()
  })

  let otp_element
  await test.step('Parse OTP Code', async () => {
    otp_element = await page.getByText('OTP: ').textContent()

    do {
      otp_element = await page.getByText('OTP: ').textContent()
    } while (otp_element?.length != 11)
  })

  await test.step('Input OTP Code and Login', async () => {
    const otp_code = otp_element.slice(-6)
    expect(otp_code.length).toEqual(6)

    await page.locator('#InputOTP').click()
    await page.locator('#InputOTP').fill(otp_code)
    await page.getByRole('button', { name: 'Verify OTP' }).click()
    await expect(page).toHaveTitle('Home')
  })

  await test.step('Access NOK My Profile Page', async () => {
    await page.goto(
      'https://outtst.werkdone.com/NOKGatewayPortal_UI/NOK_MyProfile'
    )
    await expect(page).toHaveTitle('NOK_MyProfile')
    await page.close()
  })
})

test('US14 [NOK to NOK] | Profile Data Accuracy', async ({
  page,
}, testInfo) => {
  // LOGIN
  await test.step('Input Mobile Number', async () => {
    // go to Admin login page
    await page.goto(STAFF_BASE_URL)
    await page.locator('#Input_MobileNumber').click()
    await page.locator('#Input_MobileNumber').fill(STAFF_PHONE_NUMBER)
  })

  await test.step('Click Login Button', async () => {
    await page.getByRole('button', { name: 'Login' }).click()
  })

  let otp_element
  await test.step('Parse OTP Code', async () => {
    otp_element = await page.getByText('OTP: ').textContent()

    do {
      otp_element = await page.getByText('OTP: ').textContent()
    } while (otp_element?.length != 11)
  })

  await test.step('Input OTP Code and Login', async () => {
    const otp_code = otp_element.slice(-6)
    expect(otp_code.length).toEqual(6)

    await page.locator('#InputOTP').click()
    await page.locator('#InputOTP').fill(otp_code)
    await page.getByRole('button', { name: 'Verify OTP' }).click()
    await expect(page).toHaveTitle('Home')
  })

  await test.step('Access NOK My Profile Page', async () => {
    await page.goto(
      'https://outtst.werkdone.com/NOKGatewayPortal_UI/NOK_MyProfile'
    )
    await expect(page).toHaveTitle('NOK_MyProfile')
  })

  await test.step('Expect My Profile has correct data', async () => {
    expect(await page.locator('#Input_FullName').inputValue()).toBe('Staff 01')
    expect(await page.locator('#Input_MobileNumber').inputValue()).toBe(
      STAFF_PHONE_NUMBER
    )
    await page.close()
  })
})
