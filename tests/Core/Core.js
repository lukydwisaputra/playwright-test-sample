import { test, expect, devices } from "@playwright/test";
import { wait } from "../../utils/time";
require("dotenv").config();

// ADMIN
const ADMIN_PHONE_NUMBER = process.env.ADMIN_PHONE_NUMBER;
const ADMIN_BASE_URL = process.env.ADMIN_BASE_URL;

// STAFF or NOK
const STAFF_PHONE_NUMBER = process.env.STAFF_PHONE_NUMBER;
const STAFF_BASE_URL = process.env.STAFF_BASE_URL;

module.exports = {
  test: {
    default: test,
    admin: test.extend({
      page: async ({ page }, use) => {
        // LOGIN
        await test.step("Admin Login", async () => {
          // go to Admin login page
          await page.goto(ADMIN_BASE_URL);
          await page.getByPlaceholder("e.g 8123").click();
          await page.getByPlaceholder("e.g 8123").fill(ADMIN_PHONE_NUMBER);
          await page.getByRole("button", { name: "Login" }).click();
          let otp_element = await page
            .locator("#TEMPORARYFOROTP")
            .textContent();

          do {
            otp_element = await page.locator("#TEMPORARYFOROTP").textContent();
          } while (otp_element?.length != 11);

          const otp_code = otp_element.slice(-6);
          expect(otp_code.length).toEqual(6);

          await page.getByPlaceholder("-digit OTP Code").click();
          await page.getByPlaceholder("-digit OTP Code").fill(otp_code);
          await page.getByRole("button", { name: "Verify OTP" }).click();
          // await expect(page.getByRole('banner')).toContainText('Admin 01')
        });

        // CHILD
        await use(page);

        // LOGOUT
        await test.step("Admin Logout", async () => {
          await wait(1_000);
          await page.getByRole("banner").locator("i").click();
          await page.getByText("Log Out").click();

          await expect(page).toHaveTitle("Login");
        });

        await page.close();
      },
    }),
    staff: test.extend({
      page: async ({ page }, use) => {
        // LOGIN
        await test.step("Staff Login", async () => {
          // go to Admin login page
          await page.goto(STAFF_BASE_URL);
          await page.getByPlaceholder("e.g 8123").click();
          await page.getByPlaceholder("e.g 8123").fill(STAFF_PHONE_NUMBER);
          await page.getByRole("button", { name: "Login" }).click();
          let otp_element = await page
            .locator("#TEMPORARYFOROTP")
            .textContent();

          do {
            otp_element = await page.locator("#TEMPORARYFOROTP").textContent();
          } while (otp_element?.length != 11);

          const otp_code = otp_element.slice(-6);
          expect(otp_code.length).toEqual(6);

          await page.getByPlaceholder("-digit OTP Code").click();
          await page.getByPlaceholder("-digit OTP Code").fill(otp_code);
          await page.getByRole("button", { name: "Verify OTP" }).click();
          await expect(page.getByRole("banner")).toContainText("Admin 01");
        });

        await use(page);

        await page.close();
      },
    }),
  },
  expect,
  devices
};

