import { test, expect } from "@playwright/test";
import { Admin } from "../../../../models/admin/common/admin";
import { wait } from "../../../../utils/time";
import { EventList } from "../../../../models/admin/events/event-list";

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

// Required date changes in database for today's event
// Events with id 11 - 20
test("US12: View Events - Today", async ({}, testInfo) => {
  const eventList = new EventList(page);

  await test.step("View event list - Today", async () => {
    await eventList.goTo();

    await eventList.tabToday.click();
    await expect(
      page.locator("span.vsf_title_Breadscrum_icon_title")
    ).toHaveText("Today Event");

    await wait(500);
    await testInfo.attach("View event list - Today", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await eventList.tabCompleted.click();
    await expect(
      page.locator("span.vsf_title_Breadscrum_icon_title")
    ).toHaveText("Completed Event");

    await wait(500);
    await testInfo.attach("View event list - Completed", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await eventList.tabCancelled.click();
    await expect(
      page.locator("span.vsf_title_Breadscrum_icon_title")
    ).toHaveText("Cancelled Event");

    await wait(500);
    await testInfo.attach("View event list - Cancelled", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await eventList.tabUpcoming.click();
    await expect(
      page.locator("span.vsf_title_Breadscrum_icon_title")
    ).toHaveText("Upcoming Event");

    await wait(500);
    await testInfo.attach("View event list - Upcoming", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Pagination", async () => {
    let pageCount = 1;
    await testInfo.attach(`Pagination Page ${pageCount}`, {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    while (await eventList.paginationNext.isEnabled()) {
      pageCount++;
      await eventList.paginationNext.click();

      await wait(500);
      await testInfo.attach(`Pagination Page ${pageCount}`, {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    }

    while (await eventList.paginationPrevious.isEnabled()) {
      pageCount--;
      await eventList.paginationPrevious.click();

      await wait(500);
      await testInfo.attach(`Pagination Page ${pageCount}`, {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    }
  });

  await test.step("Sorting", async () => {
    for (let i = 0; i < 2; i++) {
      await eventList.cellDate.click();

      await wait(500);
      await testInfo.attach(`Sorting Date ${i == 0 ? "ASC" : "DESC"}`, {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    }
    for (let i = 0; i < 2; i++) {
      await eventList.cellTime.click();

      await wait(500);
      await testInfo.attach(`Sorting Time ${i == 0 ? "ASC" : "DESC"}`, {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    }
    for (let i = 0; i < 2; i++) {
      await eventList.cellBookingDeadline.click();

      await wait(500);
      await testInfo.attach(
        `Sorting Bookig Deadlline ${i == 0 ? "ASC" : "DESC"}`,
        {
          body: await page.screenshot(),
          contentType: "image/png",
        }
      );
    }
  });

  await test.step("Filtering", async () => {
    await wait(500);
    await testInfo.attach("Filter initial", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await eventList.filterSearch("");
    await wait(500);
    await testInfo.attach("Filter Search", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await eventList.filterParticipantType("0");
    await wait(500);
    await testInfo.attach("Filter Participant Type", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("No records available", async () => {
    await eventList.filterSearch("asiaodsod");
    await eventList.filterParticipantType("-1");
    await expect(await page.getByText("No records found...")).toBeVisible();

    await wait(500);
    await testInfo.attach("No Records Available", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("View event details action", async () => {
    await eventList.goTo()
    await eventList.tabUpcoming.click();
    
    await wait(500)
    await eventList.viewDetails();

    await wait(500);
    await testInfo.attach("View event details", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Delete event action", async () => {
    await eventList.goTo()
    await eventList.tabUpcoming.click();

    await wait(500)
    await eventList.deleteEvents();

    await wait(500);
    await testInfo.attach("Delete event action", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });
});
