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

test('US17 [Staff to Staff] | Access Login Screen', async ({
  page,
}, testInfo) => {
  // LOGIN
  await test.step('Input Mobile Number', async () => {
    // go to Admin login page
    await page.goto(STAFF_BASE_URL)
    await page.locator('#Input_MobileNumber').click()
    await page.locator('#Input_MobileNumber').fill(STAFF_PHONE_NUMBER)
  })

  await test.step('Click Login button', async () => {
    await page.getByRole('button', { name: 'Login' }).click()
  })

  let otp_element
  await test.step('Expect Receiving OTP Code with 6 character length', async () => {
    otp_element = await page.getByText('OTP: ').textContent()

    do {
      otp_element = await page.getByText('OTP: ').textContent()
    } while (otp_element?.length != 11)

    const otp_code = otp_element.slice(-6)
    expect(otp_code.length).toEqual(6)

    await page.close()
  })
})

test('US17 [Staff to Staff] | Resend OTP', async ({ page }, testInfo) => {
  // LOGIN
  await test.step('Input Mobile Number', async () => {
    test.setTimeout(60_000)
    // go to Admin login page
    await page.goto(STAFF_BASE_URL)
    await page.locator('#Input_MobileNumber').click()
    await page.locator('#Input_MobileNumber').fill(STAFF_PHONE_NUMBER)
  })

  await test.step('Click Login Button', async () => {
    await page.getByRole('button', { name: 'Login' }).click()
  })

  await test.step('Click Resend Code', async () => {
    await wait(30_000)
    await page.getByText('Resend Code').click()
    await wait(2_000)
  })

  let otp_element
  await test.step('Parse OTP Code', async () => {
    otp_element = await page.getByText('OTP: ').textContent()
    console.log(otp_element)
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

    await page.close()
  })
})

test('US17 [Staff to Staff] | Enter OTP and Login', async ({
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

    await page.close()
  })
})

test('US17 [Staff to Staff] | Incorrect OTP Code', async ({
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

  await test.step('Input Invalid OTP Code and Login', async () => {
    await page.locator('#InputOTP').click()
    await page.locator('#InputOTP').fill('000000')
    await page.getByRole('button', { name: 'Verify OTP' }).click()
    await expect(page.locator('#InputOTP_DescribedBy')).toContainText('Invalid OTP Code');

    await page.close()
  })
})

// test('US17 [Staff to Staff] | Excessive OTP Attempts', async ({
//   page,
// }, testInfo) => {
//   // LOGIN
//   await test.step('Input Mobile Number', async () => {
//     // go to Admin login page
//     await page.goto(STAFF_BASE_URL)
//     await page.locator('#Input_MobileNumber').click()
//     await page.locator('#Input_MobileNumber').fill(STAFF_PHONE_NUMBER)
//   })

//   await test.step('Click Login Button', async () => {
//     await page.getByRole('button', { name: 'Login' }).click()
//   })

//   // await test.step('Input Invalid OTP Code and Login', async () => {
//   //   for (let i = 0; i < 5; i++) {
//   //     await page.locator('#InputOTP').click()
//   //     await page.locator('#InputOTP').fill('000000')
//   //     await page.getByRole('button', { name: 'Verify OTP' }).click()
//   //   }
//   // })
  
//   await test.step('Expect Excessive OTP Attempts', async () => {
//     // Expect Alert 
//     await expect(page.locator('#Input_MobileNumber_DescribedBy')).toContainText('Too many login attempts, try again in');
//     await page.close()
//   })
// })
