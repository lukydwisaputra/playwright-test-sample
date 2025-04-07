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

test("US16: Staff View Portfolio Page [Portfolio]", async ({}, testInfo) => {
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

  await test.step("Load more button ", async () => {
    while (await portfolio.loadMoreButton.isVisible()) {
      await portfolio.loadMoreButton.click();
      await wait(500);
    }

    await testInfo.attach("load-more-button", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Filtering", async () => {
    await portfolio.filterPublished.click();
    await wait(500);
    await testInfo.attach("filter-published", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await portfolio.filterPending.click();
    await wait(500);
    await testInfo.attach("filter-pending", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await portfolio.filterRejected.click();
    await wait(500);
    await testInfo.attach("filter-rejected", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await portfolio.filterAll.click();
    await wait(500);
    await testInfo.attach("filter-all", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await portfolio.inputEntriesSearch.fill("Resident 01");
    await wait(500);
    await testInfo.attach("filter-search", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("No record available", async () => {
    await portfolio.inputEntriesSearch.fill("emptyrecordsearch");
    await wait(500);
    await testInfo.attach("filter-search", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await portfolio.isEmptyEntries();
  });
});

test("US16: Staff View Portfolio Page [Residents]", async ({}, testInfo) => {
  const menu = new Menu(page);
  const portfolio = new Portfolio(page);

  await test.step("Access resident portfolio list", async () => {
    await menu.clickPortfolioMenu();
    await portfolio.tabResidents.click();
    await wait(500);

    await testInfo.attach("access-resident-portfolio-list", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Load more button ", async () => {
    while (await portfolio.loadMoreButton.isVisible()) {
      await portfolio.loadMoreButton.click();
      await wait(500);
    }

    await testInfo.attach("load-more-button", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Filtering", async () => {
    await portfolio.filterHousehold.click();
    await portfolio.checkAllHousehold.uncheck();
    await wait(500);

    await portfolio.checkHoushold.nth(1).check();
    await wait(500);
    await testInfo.attach("filter-household", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
    await portfolio.confirmHousehold.click();

    await portfolio.inputResidentsSearch.fill("Resident 01");
    await wait(500);
    await testInfo.attach("filter-search", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("No record available", async () => {
    await portfolio.inputResidentsSearch.fill("emptyrecordsearch");
    await wait(500);
    await testInfo.attach("filter-search", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await portfolio.isEmptyResidents();
  });
});
