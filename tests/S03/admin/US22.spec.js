import { test, expect, devices } from "@playwright/test";
import { Admin } from "../../../models/admin/common/admin";
import { wait } from "../../../utils/time";
import { PortfolioMyEntries } from "../../../models/admin/ageing-portfolio/portfolio-myentries";

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

test("US22: Admin View Portfolio My Entries", async ({}, testInfo) => {
  const portfolioMyEntries = new PortfolioMyEntries(page);

  await test.step("Access Ageing Portfolio - My Entries Page", async () => {
    await portfolioMyEntries.goTo();
    await wait(1000);
  });

  await test.step("Page exceeds more than 8 entry list", async () => {
    await portfolioMyEntries.countTableRowToBe(8);
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

    while (await portfolioMyEntries.paginationNext.isEnabled()) {
      pageCount++;
      await portfolioMyEntries.paginationNext.click();
      await wait(500);
      await testInfo.attach(`pagination-page${pageCount}`, {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    }

    while (await portfolioMyEntries.paginationPrevious.isEnabled()) {
      pageCount--;
      await portfolioMyEntries.paginationPrevious.click();
      await wait(500);
      await testInfo.attach(`pagination-page${pageCount}`, {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    }
  });

  await test.step("Sorting", async () => {
    for (let i = 0; i < 2; i++) {
      await portfolioMyEntries.cellPublishedDate.click();
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
      await portfolioMyEntries.cellActivityDate.click();
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
      await portfolioMyEntries.cellAlbum.click();
      await wait(500);
      await testInfo.attach(`sorting-album-${i == 0 ? "asc" : "desc"}`, {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    }
    for (let i = 0; i < 2; i++) {
      await portfolioMyEntries.cellResident.click();
      await wait(500);
      await testInfo.attach(`sorting-resident-${i == 0 ? "asc" : "desc"}`, {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    }
    for (let i = 0; i < 2; i++) {
      await portfolioMyEntries.cellStatus.click();
      await wait(500);
      await testInfo.attach(`sorting-status-${i == 0 ? "asc" : "desc"}`, {
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

    await portfolioMyEntries.filterSearch("Mr. Allan Breitenberg");
    await wait(500);
    await testInfo.attach("filtering-name", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await portfolioMyEntries.filterAlbum("0");
    await wait(500);
    await testInfo.attach("filtering-album", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("No records available", async () => {
    await portfolioMyEntries.filterSearch("asiaodsod");
    await wait(500);
    await testInfo.attach("No records available", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await expect(portfolioMyEntries.noRecordsText).toBeVisible();
  });

  await test.step("Click details", async () => {
    await portfolioMyEntries.goTo();
    await wait(500);
    await portfolioMyEntries.clickDetails();

    await wait(500);
    await testInfo.attach("Click details: Portfolio Details Page", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });
});
