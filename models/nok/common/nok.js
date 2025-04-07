import { expect } from "@playwright/test";

export class NOK {
  constructor(page) {
    this.page = page
    this.url = 'https://outtst.werkdone.com/NOKGateway/Login'
    this.phone = '22223333'
  }

  async login() {
    await this.page.goto(this.url)
    await this.page.locator('#Input_MobileNumber').click()
    await this.page.locator('#Input_MobileNumber').fill(this.phone)

    await this.page.getByRole('button', { name: 'Login' }).click()

    let otp_element

    otp_element = await this.page.getByText('OTP: ').textContent()
    console.log(otp_element)
    do {
      otp_element = await this.page.getByText('OTP: ').textContent()
      console.log(otp_element)
    } while (otp_element?.length != 11)

    const otp_code = otp_element.slice(-6)

    await this.page.locator('#InputOTP').click()
    await this.page.locator('#InputOTP').fill(otp_code)
    await this.page.getByRole('button', { name: 'Verify OTP' }).click()
    await this.page.locator('div.verif-nok-card').click()
    await this.page.getByRole('button', { name: 'Continue' }).click()
  }

  async logout() {
    await this.page.close()
  }
}
