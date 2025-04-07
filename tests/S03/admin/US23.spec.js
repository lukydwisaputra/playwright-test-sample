import { test, expect, devices } from "@playwright/test";
import { Admin } from "../../../models/admin/common/admin";
import { PortfolioTimeline } from "../../../models/admin/ageing-portfolio/portfolio-timeline";
import { wait } from "../../../utils/time";

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

test("US23: Admin View Portfolio Timeline", async ({}, testInfo) => {
  const portfolioTimeline = new PortfolioTimeline(page);

  await test.step("Go to portfolio timeline", async () => {
    await portfolioTimeline.goTo();
    await wait(1000);
  });

  await test.step("Page exceeds more than 8 entry list", async () => {
    await portfolioTimeline.countTableRowToBe(8);
    await wait(500);
    await testInfo.attach("Page exceeds more than 8 entry list", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Pagination", async () => {
    await wait(1000);

    let pageCount = 1;
    await testInfo.attach(`pagination-page${pageCount}`, {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    while (await portfolioTimeline.paginationNext.isEnabled()) {
      pageCount++;
      await portfolioTimeline.paginationNext.click();
      await wait(500);
      await testInfo.attach(`pagination-page${pageCount}`, {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    }

    while (await portfolioTimeline.paginationPrevious.isEnabled()) {
      pageCount--;
      await portfolioTimeline.paginationPrevious.click();
      await wait(500);
      await testInfo.attach(`pagination-page${pageCount}`, {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    }
  });

  await test.step("Sorting", async () => {
    for (let i = 0; i < 2; i++) {
      await portfolioTimeline.cellPublishedDate.click();
      await wait(500);
      await testInfo.attach(
        `sorting-published-date-${i == 0 ? "asc" : "desc"}`,
        {
          body: await page.screenshot(),
          contentType: "image/png",
        }
      );
    }
    for (let i = 0; i < 2; i++) {
      await portfolioTimeline.cellActivityDate.click();
      await wait(500);
      await testInfo.attach(
        `sorting-activity-date-${i == 0 ? "asc" : "desc"}`,
        {
          body: await page.screenshot(),
          contentType: "image/png",
        }
      );
    }
    for (let i = 0; i < 2; i++) {
      await portfolioTimeline.cellAuthor.click();
      await wait(500);
      await testInfo.attach(`sorting-author-${i == 0 ? "asc" : "desc"}`, {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    }
    for (let i = 0; i < 2; i++) {
      await portfolioTimeline.cellAlbum.click();
      await wait(500);
      await testInfo.attach(`sorting-album-${i == 0 ? "asc" : "desc"}`, {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    }
    for (let i = 0; i < 2; i++) {
      await portfolioTimeline.cellResident.click();
      await wait(500);
      await testInfo.attach(`sorting-resident-${i == 0 ? "asc" : "desc"}`, {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    }
  });

  await test.step("Filtering", async () => {
    await wait(1000);

    await testInfo.attach("filtering-initial", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await portfolioTimeline.filterSearch("Mr. Allan Breitenberg");
    await wait(500);
    await testInfo.attach("filtering-name", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await portfolioTimeline.filterAlbum("0");
    await wait(500);
    await testInfo.attach("filtering-album", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await portfolioTimeline.filterDateRange(2025, 3, 9);
    await wait(500);
    await testInfo.attach("filtering-date-range", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("No records available", async () => {
    await portfolioTimeline.filterSearch("asiaodsod");
    await wait(500);
    await testInfo.attach("No records available", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await expect(portfolioTimeline.noRecordsText).toBeVisible();
  });

  await test.step("Click details", async () => {
    await portfolioTimeline.goTo();
    await wait(500);
    await portfolioTimeline.clickDetails();

    await wait(500);
    await testInfo.attach("Click details: Portfolio Details Page", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });
});
