import { test, expect } from "@playwright/test";
import { NOK } from "../../../models/nok/common/nok";
import { Homepage } from "../../../models/nok/common/homepage";
import { wait } from "../../../utils/time";
import { Menu } from "../../../models/nok/common/menu";
import { Portfolio } from "../../../models/nok/ageing-portfolio/portfolio";

let page;
let nok;

test.use({
  viewport: { width: 480, height: 932 },
  isMobile: true,
});

// Hooks
test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  page = await context.newPage();

  nok = new NOK(page);
  await nok.login();
});

test.afterAll(async () => {
  await nok.logout();
});

test("US06: NOK View Senior Portfolio Details [Timeline]", async ({}, testInfo) => {
  const menu = new Menu(page);
  const portfolio = new Portfolio(page);

  await test.step("Empty timeline", async () => {
    await wait(1000);
    await menu.clickPortfolioMenu();
    await portfolio.cardItems.nth(1).click();
    await wait(1000);
    await expect(page).toHaveTitle("Resident");

    await wait(500);
    await testInfo.attach("empty-timeline", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("View Senior Portfolio Details (Timeline)", async () => {
    await menu.clickPortfolioMenu();
    await portfolio.cardItems.nth(0).click();
    await wait(1000);
    await expect(page).toHaveTitle("Resident");

    await testInfo.attach("senior-sportfolio-details", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Page exceeds more than 4 portfolios", async () => {
    await wait(1000);
    const totalList = await portfolio.timelineItems.count();
    expect(totalList <= 4).toBeTruthy();

    await wait(500);
    await testInfo.attach("page-exeeds-more-than-4-portfoliios", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Load more button", async () => {
    while (await portfolio.loadMoreButton.isVisible()) {
      await portfolio.loadMoreButton.click();
      await wait(500);
    }

    await wait(500);
    await testInfo.attach("load-more-button", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });
});
