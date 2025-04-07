const { test, expect } = require('../Core/Core')
const { wait } = require('../../utils/time')
require('dotenv').config()

let ADMIN_PHONE_NUMBER = process.env.ADMIN_PHONE_NUMBER

test.default('US-16: Access Login Screen', async ({ page }) => {
  await test.default.step('Override test timeout', async () => {
    test.default.setTimeout(60_000)
  })

  await test.default.step('Go to Admin login page', async () => {
    await page.goto(process.env.ADMIN_BASE_URL)
  })

  await test.default.step('Expect to receive OTP Code', async () => {
    await page.getByPlaceholder('e.g 8123').click()
    await page.getByPlaceholder('e.g 8123').fill(ADMIN_PHONE_NUMBER)
    await page.getByRole('button', { name: 'Login' }).click()
    let otp_element = await page.locator('#TEMPORARYFOROTP').textContent()
  
    do {
      otp_element = await page.locator('#TEMPORARYFOROTP').textContent()
    } while (otp_element?.length != 11)
  
    const otp_code = otp_element.slice(-6)
    expect(otp_code.length).toEqual(6)
  
    await page.close()
  })
  
})

test.default('US-16: Resend OTP', async ({ page }) => {
  await test.default.step('Override test timeout', async () => {
    test.default.setTimeout(60_000)
  })

  await test.default.step('Go to Admin login page', async () => {
    await page.goto(process.env.ADMIN_BASE_URL)
  })

  await test.default.step('Expect to receive OTP from Resend OTP action', async () => {
    await page.getByPlaceholder('e.g 8123').click()
    await page.getByPlaceholder('e.g 8123').fill(ADMIN_PHONE_NUMBER)
    await page.getByRole('button', { name: 'Login' }).click()
    await page.getByRole('link', { name: 'Resend OTP' }).click()
  
    await wait(2_000)
    let otp_element = await page.locator('#TEMPORARYFOROTP').textContent()
  
    const otp_code = otp_element?.slice(-6)
    expect(otp_code?.length).toEqual(6)
  
    await page.close()
  })

})

test.default('US-16: Enter OTP and Login', async ({ page }) => {
  await test.default.step('Override test timeout', async () => {
    test.default.setTimeout(60_000)
  })

  await test.default.step('Go to Admin login page', async () => {
    await page.goto(process.env.ADMIN_BASE_URL)
  })

  await test.default.step('Expect to receive OTP and Login', async () => {
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
  
    await page.close()
  })

})

test.default('US-16: Incorrect OTP Code', async ({ page }) => {
  await test.default.step('Override test timeout', async () => {
    test.default.setTimeout(60_000)
  })

  await test.default.step('Go to Admin login page', async () => {
    await page.goto(process.env.ADMIN_BASE_URL)
  })
  
  await test.default.step('Expect systems to reject invalid OTP Code', async () => {
    await page.getByPlaceholder('e.g 8123').click()
    await page.getByPlaceholder('e.g 8123').fill(ADMIN_PHONE_NUMBER)
    await page.getByRole('button', { name: 'Login' }).click()
  
    await page.getByPlaceholder('-digit OTP Code').click()
    await page.getByPlaceholder('-digit OTP Code').fill('000000')
    await page.getByRole('button', { name: 'Verify OTP' }).click()
    await expect(page.locator('#Input_OTP_DescribedBy')).toContainText(
      'Invalid OTP Code'
    )
  
    await page.close()
  })
})

// test.default.('US-16: Excessive OTP Attempts', async ({ page }) => {
//   // override test timeout
//   test.default.setTimeout(60_000)

//   // go to Admin login page
//   await page.goto('/NOKGateway_UI/Login')
//   await page.getByPlaceholder('e.g 8123').click()
//   await page.getByPlaceholder('e.g 8123').fill(ADMIN_PHONE_NUMBER)
//   await page.getByRole('button', { name: 'Login' }).click()

//   for (let i = 0; i < 5; i++) {
//     await page.getByPlaceholder('-digit OTP Code').click()
//     await page.getByPlaceholder('-digit OTP Code').fill("000000")
//     await page.getByRole('button', { name: 'Verify OTP' }).click()
//   }

//   await expect(page.locator('#Input_OTP_DescribedBy')).toContainText('Too many login attempts, try again in');

//   // close page
//   await page.close()
// })
