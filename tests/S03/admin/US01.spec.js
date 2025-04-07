import { test, expect, devices } from "@playwright/test";
import { Admin } from "../../../models/admin/common/admin";
import { PortfolioForm } from "../../../models/admin/ageing-portfolio/portfolio-form";
import { PortfolioTimeline } from "../../../models/admin/ageing-portfolio/portfolio-timeline";
import { wait } from "../../../utils/time";

let page;
let admin;

test.use({
  viewport: { width: 1440, height: 1080 },
});

// Hooks
test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  page = await context.newPage();

  admin = new Admin(page);
  await admin.login();
});

test.afterAll(async () => {
  await wait(500);
  await admin.logout();
});

test("US01: Update Senior Portfolio - Admin", async ({}, testInfo) => {
  const portfolioForm = new PortfolioForm(page);

  await test.step("Go to portfolio form page", async () => {
    await portfolioForm.goTo();
  });

  await test.step("Complete form", async () => {
    await portfolioForm.fillAlbumType();
    await portfolioForm.fillActivityDate();
    await portfolioForm.fillResident();
    await testInfo.attach("Complete form", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
    await portfolioForm.nextButton.click();
  });

  await test.step("Maximum Attachment Limit Enforcement", async () => {
    await portfolioForm.uploadImageCountLimit();
    await testInfo.attach("Maximum Attachment Limit Enforcement", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
    await portfolioForm.alert.click();
    await portfolioForm.resetInputImage();
  });

  await test.step("Photo Size Limit Enforcement", async () => {
    await portfolioForm.uploadImageSizeLimit();
    await testInfo.attach("Photo Size Limit Enforcement", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
    await portfolioForm.alert.click();
  });

  await test.step("Upload image(s)", async () => {
    await portfolioForm.uploadImage();
    await testInfo.attach("Upload image(s)", {
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

    await testInfo.attach("Portfolioi Preview", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Submit form", async () => {
    await portfolioForm.publishButton.click();
    await portfolioForm.isSuccess();

    await testInfo.attach("Success Page", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });
});
