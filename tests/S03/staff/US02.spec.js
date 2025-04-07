import { test, expect } from "@playwright/test";
import { Staff } from "../../../models/staff/common/staff";
import { wait } from "../../../utils/time";
import { Menu } from "../../../models/staff/common/menu";
import { Portfolio } from "../../../models/staff/ageing-portfolio/portfolio";
import { PortfolioForm } from "../../../models/staff/ageing-portfolio/portfolio-form";

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

// Test
test("US02: Update Senior Portfolio for Approval Staff", async ({}, testInfo) => {
  let menu = new Menu(page);
  let portfolio = new Portfolio(page);
  let portfolioForm = new PortfolioForm(page);

  await test.step("Go to portfoliio page", async () => {
    await menu.clickPortfolioMenu();
  });

  await test.step("Go to portfoliio form page", async () => {
    await portfolio.newEntryButton.click();
    await wait(500);
    await testInfo.attach("portfolio-form-page", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Complete form", async () => {
    await wait(500);
    await portfolioForm.fillAlbumType();
    await portfolioForm.fillActivityDate();
    await portfolioForm.fillResident();
    await page.mouse.click(10, 10);

    await wait(500);
    await testInfo.attach("complete-form", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await portfolioForm.nextButton.click();
  });

  await test.step("Next button disabled when there's no image(s) uploaded", async () => {
    await portfolioForm.isNextButtonDisabled();

    await testInfo.attach("disabled-next-button", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Maximum Attachment Limit Enforcement", async () => {
    await portfolioForm.uploadImageCountLimit();
    await testInfo.attach("maximum-attachment-limit-enforcement", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
    await portfolioForm.alert.click();
    await portfolioForm.resetInputImage();
  });

  await test.step("Photo Size Limit Enforcement", async () => {
    await portfolioForm.uploadImageSizeLimit();
    await testInfo.attach("photo-size-limit-enforcement", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
    await portfolioForm.alert.click();
  });

  await test.step("Upload image(s)", async () => {
    await portfolioForm.uploadImage();
    await testInfo.attach("upload-image(s)", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
    await portfolioForm.nextButton.click();
  });

  await test.step("Edit form", async () => {
    await portfolioForm.editButton.click();
    await portfolioForm.checkInputOnEdit();
    await portfolioForm.nextButton.click();
    await portfolioForm.checkImageOnEdit();
    await portfolioForm.nextButton.click();

    await testInfo.attach("portfolio-preview", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Submit form", async () => {
    await portfolioForm.submitButton.click();
    await portfolioForm.isSuccess();

    await testInfo.attach("success-page", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });
});
