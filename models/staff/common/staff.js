import { expect } from "@playwright/test";

export class Staff {
  constructor(page) {
    this.page = page;
    this.url = "https://outtst.werkdone.com/NOKGateway/Login";
    this.name = "staffgadungan";
    this.phone = "91234567";
  }

  async login() {
    await this.page.goto(this.url);
    await this.page.locator("#Input_MobileNumber").click();
    await this.page.locator("#Input_MobileNumber").fill(this.phone);

    await this.page.getByRole("button", { name: "Login" }).click();

    let otp_element = await this.page.getByText("OTP: ").textContent();

    do {
      otp_element = await this.page.getByText("OTP: ").textContent();
    } while (otp_element?.length != 11);

    const otp_code = otp_element.slice(-6);

    await this.page.locator("#InputOTP").click();
    await this.page.locator("#InputOTP").fill(otp_code);
    await this.page.getByRole("button", { name: "Verify OTP" }).click();
    await expect(this.page.locator("div.hp_top_links_name span")).toContainText(
      this.name
    );
  }

  async logout() {
    await this.page.getByRole("banner").locator("i").nth(1).click();
    await this.page.getByRole("button", { name: "Logout" }).click();
    await this.page.close();
  }
}
