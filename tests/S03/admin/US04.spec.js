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

test("US04: Delete Senior Photos from Portfolio Album", async ({}, testInfo) => {
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
    await tabAgeingPortfolio.tabAlbum.click();

    await await wait(500);
    await testInfo.attach("ageing-portfolio-tab-album", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Open first album in the list", async () => {
    await tabAgeingPortfolio.openSelectedAlbum(0);
    await wait(1000);

    while (await tabAgeingPortfolio.loadMoreButton.isVisible()) {
      await tabAgeingPortfolio.loadMoreButton.click();
      await wait(500);
    }

    await wait(1000);
    await testInfo.attach("album-details", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Open first album in the list", async () => {
    await tabAgeingPortfolio.deleteImage();

    await wait(500);
    await testInfo.attach("delete-image", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });
});
