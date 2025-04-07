import { test, expect } from "@playwright/test";
import { Admin } from "../../../../models/admin/common/admin";
import { wait } from "../../../../utils/time";
import { EventList } from "../../../../models/admin/events/event-list";
import { EventDetails } from "../../../../models/admin/events/event-details";
import { EventForm } from "../../../../models/admin/events/event-form";

let page;
let admin;

test.use({
  viewport: { width: 2056, height: 1440 },
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

test("US23: Add Participants to Created Event", async ({}, testInfo) => {
  const eventList = new EventList(page);
  const eventDetails = new EventDetails(page);
  const eventForm = new EventForm(page);

  await test.step("Access event list page", async () => {
    await eventList.goTo();
    await eventList.tabUpcoming.click();
    await expect(page).toHaveTitle("EventList");

    await wait(250);
    await testInfo.attach("Access upcoming event list page", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Filter participant type to NOK and Resident", async () => {
    await eventList.filterParticipantType.selectOption("2");

    await wait(250);
    await testInfo.attach("Filter participant type to NOK and Resident", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Go to event details page", async () => {
    await wait(500);
    await eventList.viewDetails();
    await eventDetails.tabAttendees.click();

    await eventForm.fillManuallyRegister();

    await wait(250);
    await testInfo.attach("Go to event details page", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });
});
