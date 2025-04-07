import { test, expect } from "@playwright/test";
import { Admin } from "../../../models/admin/common/admin";
import { wait } from "../../../utils/time";
import { PortfolioApproval } from "../../../models/admin/ageing-portfolio/portfolio-approval";
import { PortfolioEdit } from "../../../models/admin/ageing-portfolio/portfolio-edit";

let page;
let admin;

test.use({
  headless: true,
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

test("US14: Portfolio Approval Edit New Portfolio", async ({}, testInfo) => {
  const portfolioApproval = new PortfolioApproval(page);
  const portfolioEdit = new PortfolioEdit(page);

  await test.step("Go to portfolio approval page", async () => {
    await portfolioApproval.goTo();
    await wait(500);

    await testInfo.attach("porfolio-approval-page", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Filter by pending status", async () => {
    await portfolioApproval.filterStatus("0");

    await wait(500);
    await testInfo.attach("filter-status-pending", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("View portfolio details", async () => {
    await portfolioApproval.clickDetails();
    await wait(500);
    await testInfo.attach("portfolio-details-page", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Edit portfolio", async () => {
    await portfolioApproval.editButton.click();
    await wait(500);

    await testInfo.attach("edit-portfolio-form", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Delete all image", async () => {
    await portfolioEdit.selectAllImageCheckbox.check();
    await wait(500);

    await testInfo.attach("delete-all-image", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await portfolioEdit.deleteButton.click();
    await wait(500);

    await testInfo.attach("empty-image", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    expect(await portfolioEdit.imageItems.count()).toBe(0);
  });

  await test.step("Photo Size Limit Enforcement", async () => {
    await portfolioEdit.uploadImageSizeLimit();

    await testInfo.attach("photo-size-limit-enforcement", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
    await portfolioEdit.alert.click()
    
  });

  await test.step("Maximum Attachment Limit Enforcement", async () => {
    await portfolioEdit.uploadImageCountLimit();

    await testInfo.attach("maximum-attachment-limit-enforcement", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await portfolioEdit.alert.click()
  });

  await test.step("Delete selected image(s)", async () => {
    await portfolioEdit.deleteMultipleImage();

    await testInfo.attach("delete-selected-image", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  // await test.step("Approve submitted portfolio", async () => {
  //   await portfolioEdit.approveButton.click();
  //   await portfolioEdit.confirmButton.click();
  // });
});
