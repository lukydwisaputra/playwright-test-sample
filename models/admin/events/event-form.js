import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { wait } from "../../../utils/time";
import { start } from "repl";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getRandomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function generateDates() {
  try {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    // Generate startDate in a month after the current month
    let startDateYear = currentYear;
    let startDateMonth = currentMonth + 1;
    if (startDateMonth > 11) {
      startDateMonth = 0;
      startDateYear += 1;
    }

    // Get the last day of the startDateMonth
    const lastDayOfStartDateMonth = new Date(
      startDateYear,
      startDateMonth + 1,
      0
    ).getDate();
    const startDate = getRandomDate(
      new Date(startDateYear, startDateMonth, 1),
      new Date(startDateYear, startDateMonth, lastDayOfStartDateMonth)
    );

    // Generate dueDate after today but before startDate
    if (startDate <= today) {
      throw new Error("Generated startDate is not after today.");
    }

    const dueDate = getRandomDate(today, startDate);
    return {
      startDate: startDate > dueDate ? startDate : dueDate,
      dueDate: startDate > dueDate ? dueDate : startDate,
    };
  } catch (error) {
    console.error("Error generating dates:", error.message);
    return null;
  }
}

const randomDate = generateDates();

export class EventForm {
  constructor(page) {
    // common component
    this.page = page;
    this.url = "https://outtst.werkdone.com/NOKAdmin/EventDetail?EventId=0";

    this.title = faker.lorem.sentence();
    this.eventInfo = faker.lorem.paragraphs(3);
    this.location = faker.location.streetAddress({ useFullAddress: true });

    this.capacity = faker.number.int({ min: 1, max: 10 }) * 10;
    this.participants = faker.number.int({ min: 0, max: 2 });

    // input form details component
    this.inputImage = page.getByLabel("Add Media");
    this.inputTitle = page.getByLabel("Title");
    this.inputEventInformation = page.getByPlaceholder(
      "Enter the information of the"
    );
    this.inputLocation = page.getByLabel("Location");
    this.inputDate = page.getByRole("textbox", { name: "Select Date" }).nth(0);
    // @calendarYear
    // component: input
    // type: number (2023)
    this.calendarYearStart = page.locator("input.numInput.cur-year").nth(0);
    // @calendarMonth
    // component: dropdown
    // type: string ("1") start from 0
    this.calendarMonthStart = page
      .locator("select.flatpickr-monthDropdown-months")
      .nth(0);

    this.inputBookingDeadline = page
      .getByRole("textbox", { name: "Select Date" })
      .nth(1);
    // @calendarYear
    // component: input
    // type: number (2023)
    this.calendarYearDue = page.locator("input.numInput.cur-year").nth(1);
    // @calendarMonth
    // component: dropdown
    // type: string ("1") start from 0
    this.calendarMonthDue = page
      .locator("select.flatpickr-monthDropdown-months")
      .nth(1);

    this.inputHost = page.getByLabel("Host");
    this.inputCoHost = page.getByLabel("Co-host(s)");

    this.inputStartTime = page
      .locator("div")
      .filter({ hasText: /^Start Time\*$/ })
      .getByRole("textbox");

    this.inputEndTime = page
      .locator("div")
      .filter({ hasText: /^End Time\*$/ })
      .getByRole("textbox");

    this.inputHour = page.getByRole("spinbutton", { name: "Hour" });
    this.inputMinute = page.getByRole("spinbutton", { name: "Minute" });

    //input form attendees
    this.inputTargetAttendees = page.getByLabel("Send invite to target");
    this.inputManuallyRegister = page.getByLabel(
      "Manually register resident(s)"
    );
    this.inputCapacity = page.getByPlaceholder("Enter maximum capacity of");
    this.inputParticipant = page.getByLabel("Participant");

    this.inputDementia = page.locator(".vscomp-ele-wrapper").nth(0);
    this.inputMobility = page.locator(".vscomp-ele-wrapper").nth(1);
    this.inputReligion = page.locator(".vscomp-ele-wrapper").nth(2);

    this.inputSearchManualRegister = page.getByPlaceholder(
      "Search by resident name"
    );

    // button component
    this.nextButtonTop = page.getByRole("button", { name: "Next" }).first();
    this.backButtonTop = page.getByRole("button", { name: "Back" }).first();
    this.publishButtonTop = page
      .getByRole("button", { name: "Publish" })
      .first();

    this.nextButtonBottom = page.getByRole("button", { name: "Next" }).nth(1);
    this.backButtonBottom = page.getByRole("button", { name: "Back" }).nth(1);
    this.publishButtonBottom = page
      .getByRole("button", { name: "Publish" })
      .first();

    this.deleteImageButton = page.locator(".PWIm_CloseIconSize").first();

    this.addAttendeeButton = page.getByRole("button", { name: "Add Attendee" });
    this.confirmButton = page.getByRole("button", { name: "Confirm" });
    this.cancelButton = page.getByRole("button", { name: "Cancel" });

    this.removeSelectedButton = page.getByRole("button", {
      name: "Remove Selected",
    });

    // images
    this.imageList = [
      "images/image1.jpg",
      "images/image2.jpg",
      "images/image3.jpg",
      "images/image4.jpg",
      "images/image5.jpg",
      "images/image6.jpg",
      "images/image7.jpg",
      "images/image8.jpg",
      "images/image9.jpg",
      "images/image10.jpg",
      "images/image11.jpg",
    ];
    this.bigimage = "images/bigimage2.jpg";

    // alert
    this.alert = page.locator(".feedback-message-text");

    // target attendees
    this.dementia = ["None", "Mild", "Moderate", "Severe"];
    this.mobility = ["Ambulatory", "Bedbound", "Wheelchair-bound", "Geriatric"];
    this.religion = [
      "Buddhism",
      "Catholicism",
      "Christianity",
      "Free Thinker",
      "Hinduism",
      "Islam",
      "Sikhism",
      "Taoism",
      "Others",
    ];

    // manually register
    this.inputResidentSearch = page.locator(".vscomp-ele-wrapper");
    this.inputResidentSearchItem = page.locator(".vscomp-option-text");
  }

  async goTo() {
    await this.page.goto(this.url);
  }

  async uploadImageSizeLimit() {
    await this.inputImage.setInputFiles(this.bigimage);
    await wait(2_000);
    await expect(
      this.alert.filter({
        hasText: "The file is too large to upload, please re-upload.",
      })
    ).toBeVisible({ timeout: 10_000 });
    await expect
      .soft(this.alert)
      .toContainText("The file is too large to upload, please re-upload.");
  }

  async uploadImage() {
    await this.inputImage.setInputFiles(
      this.imageList[faker.number.int({ min: 0, max: 10 })]
    );
  }

  async deleteImage() {
    await this.deleteImageButton.click();
  }

  async fillTitle() {
    await this.inputTitle.fill(this.title);
  }

  async fillEventInfo() {
    await this.inputEventInformation.fill(this.eventInfo);
  }

  async fillLocation() {
    await this.inputLocation.fill(this.location);
  }

  async fillDate() {
    const startDate = randomDate.startDate;

    const year = startDate.getFullYear().toString();
    const month = startDate.getMonth();
    const monthStr = month.toString();
    const fullMonthStr = monthNames[month];
    const day = startDate.getDate();
    const dayStr = day.toString();

    const selectedStartDate = `${fullMonthStr} ${dayStr}, ${year}`;
    console.log("selectedStartDate: " + selectedStartDate);

    await this.inputDate.click();
    await wait(500);
    await this.calendarYearStart.click();
    await this.calendarYearStart.fill(year);
    await wait(500);
    await this.calendarMonthStart.click();
    await this.calendarMonthStart.selectOption(monthStr);
    await wait(500);
    const selector = `span.flatpickr-day[aria-label$="${selectedStartDate}"]`;
    await this.page.locator(selector).first().waitFor({ state: "visible" });
    await this.page.locator(selector).first().click();
  }

  async fillBookingDeadline() {
    const dueDate = randomDate.dueDate;

    const year = dueDate.getFullYear().toString();
    const month = dueDate.getMonth();
    const monthStr = month.toString();
    const fullMonthStr = monthNames[month];
    const day = dueDate.getDate();
    const dayStr = day.toString();

    const selectedDueDate = `${fullMonthStr} ${dayStr}, ${year}`;
    console.log("selectedDueDate: " + selectedDueDate);

    await this.inputBookingDeadline.click();
    // await wait(500);
    // await this.calendarYearDue.click();
    // await this.calendarYearDue.fill(year);
    await wait(500);
    await this.calendarMonthDue.click();
    await wait(250);
    await this.calendarMonthDue.selectOption(monthStr);
    await wait(1500);
    const selector = `span.flatpickr-day[aria-label$="${selectedDueDate}"]`;
    await this.page.locator(selector).nth(1).waitFor({ state: "visible" });
    await this.page.locator(selector).nth(1).click();
  }

  async fillStartTime() {
    await this.inputStartTime.click();
    await wait(100);
    await this.inputHour.fill("17");
    await this.inputMinute.fill("30");
    await this.inputMinute.press("Enter");
  }

  async fillEndTime() {
    await wait(500);
    await this.inputEndTime.click();
    await wait(500);
    await this.inputHour.fill("19");
    await wait(500);
    await this.inputMinute.fill("30");
    // await wait(100);
    await this.inputMinute.press("Enter");
  }

  async fillHost() {
    await this.inputHost.selectOption(
      "10"
      // faker.number.int({ min: 0, max: 9 }).toString()
    );
  }

  async fillCoHost() {
    await this.page.locator("#b6-b1-b7-DropdownTags").first().click();

    await this.page
      .locator(".vscomp-option")
      .nth(faker.number.int({ min: 0, max: 9 }))
      .click();

    await this.page.locator("#b6-b1-b7-DropdownTags").first().click();
  }

  async fillCapacity() {
    await this.inputCapacity.fill(this.capacity.toString());
  }

  async fillParticipant() {
    await this.inputParticipant.selectOption(this.participants.toString());
  }

  async checkTargetAttendees() {
    await this.inputTargetAttendees.check();
  }

  async checkManuallyRegister() {
    await this.inputManuallyRegister.check();
  }

  async fillDementia() {
    await this.inputDementia.click();
    await this.page
      .getByText(this.dementia[faker.number.int({ min: 0, max: 3 })], {
        exact: true,
      })
      .click();
  }

  async fillMobility() {
    await this.inputMobility.click();
    await this.page
      .getByText(this.mobility[faker.number.int({ min: 0, max: 3 })], {
        exact: true,
      })
      .click();
  }

  async fillReligion() {
    await this.inputReligion.click();
    await this.page
      .getByText(this.religion[faker.number.int({ min: 0, max: 8 })], {
        exact: true,
      })
      .click();
  }

  async fillManuallyRegister() {
    await this.addAttendeeButton.click();

    await wait(250);
    await this.inputResidentSearch.click();

    await wait(250);
    let totalResident = await this.inputResidentSearchItem.count();

    const residentOptionIndex = faker.number.int({
      min: 0,
      max: totalResident - 1,
    });
    const residentName = await this.inputResidentSearchItem
      .nth(residentOptionIndex)
      .innerText();

    console.log(residentName);

    await this.inputResidentSearchItem.nth(residentOptionIndex).click();
    await wait(250);

    const isAlertVisible = await this.alert
      .getByText("Selected resident already exist. Select another resident")
      .isVisible();

    if (isAlertVisible) {
      await wait(250);
      await this.cancelButton.click();
      await wait(250);
      await this.alert.click();
    } else {
      await wait(250);
      await this.confirmButton.click();
      await wait(250);
      await this.alert.click();
    }
  }

  async deleteSelectedResident() {
    const totalRow = await this.page.locator("tbody tr").count();

    const residentOptionIndex = faker.number.int({
      min: 0,
      max: totalRow - 1,
    });

    await this.page
      .locator("tbody tr")
      .nth(residentOptionIndex)
      .locator("td input.checkbox")
      .click();

    const residentName = await this.page
      .locator("tbody tr")
      .nth(residentOptionIndex)
      .locator("td")
      .nth(1)
      .innerText();

    console.log(residentName);

    await this.removeSelectedButton.click();
    await this.confirmButton.click();

    await wait(500);
    await this.inputSearchManualRegister.click();
    await this.inputSearchManualRegister.fill(residentName);
    expect(await this.page.locator("tbody tr").count()).toBe(0);
  }
}
