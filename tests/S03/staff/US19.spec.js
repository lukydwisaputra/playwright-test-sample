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

test("US19: Staff View Portfolio [Album]", async ({}, testInfo) => {
  const menu = new Menu(page);
  const portfolio = new Portfolio(page);

  await test.step("Access album portfolio list", async () => {
    await menu.clickPortfolioMenu();
    await portfolio.tabResidents.click();
    await wait(500);

    await testInfo.attach("access-album-portfolio-list", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("View Senior Portfolio Details [Album]", async () => {
    await portfolio.inputResidentsSearch.fill("Resident 01");
    await wait(500);
    await testInfo.attach("filter-search", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await portfolio.residentItems.first().click();
    await expect(page).toHaveTitle("Resident");

    await portfolio.tabAlbum.click();
    await wait(1000);
    await testInfo.attach("senior-portfolio-album", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("View Album Details", async () => {
    await portfolio.AlbumPortfolioItems.first().click();

    await wait(1000);
    await testInfo.attach("album-details", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  // await test.step("Album items exceeds more than 6 images", async () => {
  //   await wait(500);
  //   expect(await portfolio.albumImageItems.count()).toBe(6);
  // });

  await test.step("Load more button", async () => {
    await wait(1000);
    while (await portfolio.loadMoreButton.isVisible()) {
      await portfolio.loadMoreButton.click();
      await wait(500);
    }

    await testInfo.attach("load-more-button", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });
});
