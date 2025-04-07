import { wait } from "../../../utils/time";
import { expect } from "@playwright/test";

export class Admin {
  constructor(page) {
    this.page = page;
    this.url = "https://outtst.werkdone.com/NOKAdmin/Login";
    this.name = "superadmingadungan";
    this.phone = "99998888";
  }

  async login() {
    await this.page.goto(this.url);
    await this.page.getByPlaceholder("e.g 8123").click();
    await this.page.getByPlaceholder("e.g 8123").fill(this.phone);
    await this.page.getByRole("button", { name: "Login" }).click();

    let otp_element = await this.page.locator("#TEMPORARYFOROTP").textContent();

    do {
      otp_element = await this.page.locator("#TEMPORARYFOROTP").textContent();
    } while (otp_element?.length != 11);

    const otp_code = otp_element.slice(-6);
    expect(otp_code.length).toEqual(6);

    await this.page.getByPlaceholder("-digit OTP Code").click();
    await this.page.getByPlaceholder("-digit OTP Code").fill(otp_code);
    await this.page.getByRole("button", { name: "Verify OTP" }).click();
    await expect(this.page.getByRole("banner").getByText(this.name)).toBeVisible();
  }

  async logout() {
    await wait(500);
    await this.page.locator("div.popover-top").click();
    await this.page.getByText("Log Out").click();
    await this.page.close();
  }
}
