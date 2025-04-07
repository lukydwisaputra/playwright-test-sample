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

test("US05: NOK View Senior List", async ({}, testInfo) => {
  const menu = new Menu(page);
  const portfolio = new Portfolio(page);

  await test.step("View Senior List", async () => {
    await menu.clickPortfolioMenu();
    await expect(page).toHaveTitle("Portfolio");

    await testInfo.attach("view-senior-list", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Page exceeds more than 4 portfolios", async () => {
    const totalList = await portfolio.cardItems.count();
    expect(totalList > 0 && totalList <= 4).toBeTruthy();

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
