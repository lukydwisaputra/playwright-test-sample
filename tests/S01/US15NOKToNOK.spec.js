import { test, expect, devices } from '@playwright/test'
import { wait } from '../../utils/time'
require('dotenv').config()

// STAFF or NOK
const NOK_PHONE_NUMBER = process.env.NOK_PHONE_NUMBER
const NOK_BASE_URL = process.env.NOK_BASE_URL

test.use({
  ...devices['iPhone 13'],
  isMobile: true,
})

test('US15 [NOK to NOK] | Update Profile Details', async ({
  page,
}, testInfo) => {
  // LOGIN
  await test.step('Input Mobile Number', async () => {
    // go to Admin login page
    await page.goto(NOK_BASE_URL)
    await page.locator('#Input_MobileNumber').click()
    await page.locator('#Input_MobileNumber').fill(NOK_PHONE_NUMBER)
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
    await page.locator('div.verif-nok-card').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page).toHaveTitle('Home')
  })

  await test.step('Access NOK My Profile Page', async () => {
    await page.goto(
      'https://outtst.werkdone.com/NOKGatewayPortal_UI/NOK_MyProfile'
    )
    await expect(page).toHaveTitle('NOK_MyProfile')
  })

  await test.step('Access NOK My Profile Page', async () => {
    await page.goto(
      'https://outtst.werkdone.com/NOKGatewayPortal_UI/NOK_MyProfile'
    )
    await expect(page).toHaveTitle('NOK_MyProfile')
  })

  let initialFullName
  let initialMobileNumber
  await test.step('Parse Initial Profile', async () => {
    initialFullName = await page.locator('#Input_FullName').inputValue()
    initialMobileNumber = await page.locator('#Input_MobileNumber').inputValue()
  })

  await test.step('Fill Edit My Profile Form', async () => {
    await page.getByPlaceholder('Name of NOK as in NRIC').click()
    await page.getByPlaceholder('Name of NOK as in NRIC').fill('NOK 10')

    await page.getByPlaceholder('4567').fill('85077342')
    await page.getByRole('button', { name: 'Send OTP' }).click()

    let otp_element
    otp_element = await page.getByText('OTP: ').textContent()

    do {
      otp_element = await page.getByText('OTP: ').textContent()
    } while (otp_element?.length != 11)

    const otp_code = otp_element.slice(-6)
    expect(otp_code.length).toEqual(6)

    await page.getByLabel('OTP Code').click()
    await page.getByLabel('OTP Code').fill(otp_code)

    await page.getByRole('button', { name: 'Verify OTP' }).click()

    await expect(
      page.getByRole('button', { name: 'Update My Profile' })
    ).toBeEnabled()
    await wait(1_000)
    await page.getByRole('button', { name: 'Update My Profile' }).click()
  })

  await test.step('Put back initial data', async () => {
    await page.getByPlaceholder('Name of NOK as in NRIC').click()
    await page.getByPlaceholder('Name of NOK as in NRIC').fill(initialFullName)

    await page.getByPlaceholder('4567').fill(initialMobileNumber)
    await page.getByRole('button', { name: 'Send OTP' }).click()
    await wait(2_000)

    let otp_element
    otp_element = await page.getByText('OTP: ').textContent()

    do {
      otp_element = await page.getByText('OTP: ').textContent()
    } while (otp_element?.length != 11)

    const otp_code = otp_element.slice(-6)
    expect(otp_code.length).toEqual(6)

    await page.getByLabel('OTP Code').click()
    await page.getByLabel('OTP Code').fill(otp_code)

    await page.getByRole('button', { name: 'Verify OTP' }).click()

    await expect(
      page.getByRole('button', { name: 'Update My Profile' })
    ).toBeEnabled()
    await wait(1_000)
    await page.getByRole('button', { name: 'Update My Profile' }).click()
    await page.close()
  })
})
