import { test, expect } from "@playwright/test";
import { Admin } from "../../../models/admin/common/admin";
import { wait } from "../../../utils/time";
import { PortfolioApproval } from "../../../models/admin/ageing-portfolio/portfolio-approval";

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

test("US13: Porfolio Approval [Approve]", async ({}, testInfo) => {
  const portfolioApproval = new PortfolioApproval(page);

  await test.step("Go to portfolio approval page", async () => {
    await portfolioApproval.goTo();

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

  await test.step("Approve portfolio", async () => {
    await portfolioApproval.approveButton.click();

    await wait(500);
    await testInfo.attach("popup-approval", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await portfolioApproval.confirmButton.click();
  });
});

test("US13: Porfolio Approval [Reject]", async ({}, testInfo) => {
  const portfolioApproval = new PortfolioApproval(page);

  await test.step("Go to portfolio approval page", async () => {
    await portfolioApproval.goTo();

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

  await test.step("Reject portfolio", async () => {
    await portfolioApproval.rejectButton.click();
    await portfolioApproval.fillRemarks();

    await wait(500);
    await testInfo.attach("popup-rejection", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await portfolioApproval.confirmButton.click();
  });
});

