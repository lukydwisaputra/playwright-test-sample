import { test, expect } from "@playwright/test";
import { Admin } from "../../../../models/admin/common/admin";
import { wait } from "../../../../utils/time";
import { EventList } from "../../../../models/admin/events/event-list";
import { EventForm } from "../../../../models/admin/events/event-form";

let page;
let admin;

test.use({
  viewport: { width: 1440, height: 1640 },
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

test("US13: Create new event", async ({}, testInfo) => {
  const eventList = new EventList(page);
  const eventForm = new EventForm(page);

  await test.step("Access create event form ", async () => {
    await eventList.goTo();
    await eventList.createEventButton.click();
    await expect(page).toHaveTitle("EventDetail");

    await testInfo.attach("Access create event form", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  // await test.step("Photo Size Limit Enforcement", async () => {
  //   await eventForm.uploadImageSizeLimit();
  // });

  await test.step("Upload Image", async () => {
    await eventForm.uploadImage();
    await wait(250);
    await testInfo.attach("Upload image 1", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await eventForm.deleteImage();
    await testInfo.attach("Delete image", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await eventForm.uploadImage();
    await wait(250);
    await testInfo.attach("Upload image 2", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Fill input details form", async () => {
    await eventForm.fillTitle();
    await eventForm.fillEventInfo();
    await eventForm.fillLocation();
    await eventForm.fillDate();

    await test.step("US21: Event Consent Time Limit", async () => {
      await eventForm.fillBookingDeadline();

      await wait(250);
      await testInfo.attach("Event Consent Time Limit", {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    });

    await eventForm.fillStartTime();
    await eventForm.fillEndTime();
    await eventForm.fillHost();
    await eventForm.fillCoHost();

    await wait(250);
    await testInfo.attach("Fill input details form", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
    await wait(250);
    await testInfo.attach("Fill input details form", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  await test.step("Fill input attendees form", async () => {
    await eventForm.nextButtonBottom.click();
    await wait(250);

    await eventForm.fillCapacity();
    await eventForm.fillParticipant();
    await eventForm.checkTargetAttendees();

    await wait(250);
    await testInfo.attach("Fill input attendees form", {
      body: await page.screenshot(),
      contentType: "image/png",
    });

    await eventForm.publishButtonBottom.click();
  });

  await test.step("Success form page", async () => {
    await expect(await page.locator("#b1-MainContent")).toContainText(
      "Event Published"
    );

    await wait(250);
    await testInfo.attach("Success form page", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });
});
