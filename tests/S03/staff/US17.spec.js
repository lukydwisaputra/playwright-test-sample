import { test, expect } from "@playwright/test";
import { Staff } from "../../../models/staff/common/staff";
import { wait } from "../../../utils/time";
import { Menu } from "../../../models/staff/common/menu";
import { Portfolio } from "../../../models/staff/ageing-portfolio/portfolio";

test.use({
  viewport: { width: 480, height: 932 },
  isMobile: true,
});

let page;
let staff;

// Hooks
test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  page = await context.newPage();

  staff = new Staff(page);
  await staff.login();
});

test.afterAll(async () => {
  await staff.logout();
});

test("US17: Staff View Portfolio Details [Edit]", async ({}, testInfo) => {
  const menu = new Menu(page);
  const portfolio = new Portfolio(page);

  await test.step("Access portfolio list", async () => {
    await menu.clickPortfolioMenu();
    await wait(500);

    await testInfo.attach("access-portfolio-list", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Go to portfolio details", async () => {
    await portfolio.filterPending.click();
    await wait(1000);

    await portfolio.entryItems.nth(0).click();
    await expect(page).toHaveTitle("PortfolioDetail");
    await wait(500);

    await testInfo.attach("portfolio-details", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Resubmit pending portfolio", async () => {
    await portfolio.editButton.click();
    await wait(500);
    await testInfo.attach("edit-portfolio-before", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
    await portfolio.fillActivityDate();
    await wait(500);
    await testInfo.attach("edit-portfolio-after", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await portfolio.nextButton.click();

    await expect(await portfolio.imageItems).toBeVisible();
    await wait(500);
    await testInfo.attach("edit-portfolio-image", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await portfolio.nextButton.click();
    await wait(500);
    await testInfo.attach("edit-portfolio-preview", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await portfolio.submitButton.click();
    await wait(1000);
    await testInfo.attach("edit-portfolio-success", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await portfolio.isSuccess();
  });
});

test("US17: Staff View Portfolio Details [Delete]", async ({}, testInfo) => {
  const menu = new Menu(page);
  const portfolio = new Portfolio(page);

  await test.step("Access portfolio list", async () => {
    await menu.clickPortfolioMenu();
    await wait(500);

    await testInfo.attach("access-portfolio-list", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Go to portfolio details", async () => {
    await portfolio.filterPending.click();
    await wait(1000);

    await portfolio.entryItems.nth(0).click();
    await expect(page).toHaveTitle("PortfolioDetail");
    await wait(500);

    await testInfo.attach("portfolio-details", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Delete pending portfolio", async () => {
    await portfolio.deleteButton.click();
    await wait(500);
    await testInfo.attach("delete-portfolio", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await portfolio.confirmButton.click();
  });
});
