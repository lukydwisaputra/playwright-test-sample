import { test, expect, devices } from "@playwright/test";
import { Admin } from "../../../models/admin/common/admin";
import { wait } from "../../../utils/time";
import { ResidentList } from "../../../models/admin/users/resident-list";
import { ResidentDetails } from "../../../models/admin/users/resident-detail";
import { ResidentDetailsTabAgeingPortfolio } from "../../../models/admin/users/resident-detail-tab-ageing-portfolio";

let page;
let admin;

test.use({
  viewport: { width: 1920, height: 1440 },
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

test("US21: Admin View Senior Profile [Portfolio]", async ({}, testInfo) => {
  const residentList = new ResidentList(page);
  const residentDetails = new ResidentDetails(page);
  const tabAgeingPortfolio = new ResidentDetailsTabAgeingPortfolio(page);

  await test.step("Go to resident list page", async () => {
    await residentList.goTo();
    await wait(500);

    await testInfo.attach("resident-list", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Go to resident list profile page", async () => {
    await residentList.clickSelectedDetails(0);
    await residentDetails.tabAgeingPortfolio.click();

    await await wait(500);
    await testInfo.attach("table-exceeds-more-than-8-portfolio-list", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Pagination", async () => {
    let pageCount = 1;
    await testInfo.attach(`pagination-page${pageCount}`, {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    while (await tabAgeingPortfolio.paginationNext.isEnabled()) {
      pageCount++;
      await tabAgeingPortfolio.paginationNext.click();
      await wait(500);
      await testInfo.attach(`pagination-page${pageCount}`, {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    }

    while (await tabAgeingPortfolio.paginationPrevious.isEnabled()) {
      pageCount--;
      await tabAgeingPortfolio.paginationPrevious.click();
      await wait(500);
      await testInfo.attach(`pagination-page${pageCount}`, {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    }
  });

  await test.step("Sorting", async () => {
    for (let i = 0; i < 2; i++) {
      await tabAgeingPortfolio.cellPublishedDate.click();
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
      await tabAgeingPortfolio.cellActivityDate.click();
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
      await tabAgeingPortfolio.cellAuthor.click();
      await wait(500);
      await testInfo.attach(`sorting-author-${i == 0 ? "asc" : "desc"}`, {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    }
    for (let i = 0; i < 2; i++) {
      await tabAgeingPortfolio.cellAlbum.click();
      await wait(500);
      await testInfo.attach(`sorting-album-${i == 0 ? "asc" : "desc"}`, {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    }
    for (let i = 0; i < 2; i++) {
      await tabAgeingPortfolio.cellResident.click();
      await wait(500);
      await testInfo.attach(`sorting-resident-${i == 0 ? "asc" : "desc"}`, {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    }
  });

  await test.step("No records available", async () => {
    await residentList.goTo();
    await residentList.filterSearch("Dr. Simon Homenick PhD");
    await wait(500);

    await residentList.clickSelectedDetails(0);
    await residentDetails.tabAgeingPortfolio.click();
    await wait(500);

    await testInfo.attach("no-records-available", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });
});
