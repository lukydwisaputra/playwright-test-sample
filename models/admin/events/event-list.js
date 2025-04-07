import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { wait } from "../../../utils/time";

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
let selectedDate = "";

export class EventList {
  constructor(page) {
    // common component
    this.page = page;
    this.url = "https://outtst.werkdone.com/NOKAdmin/EventList";

    // button component
    this.createEventButton = page.getByRole("button", { name: "Create Event" });
    this.confirmButton = page.getByRole("button", { name: "Confirm" });
    this.paginationNext = page.getByLabel("go to next page");
    this.paginationPrevious = page.getByLabel("go to previous page");

    // tab component
    this.tabToday = page.getByText("Today", { exact: true });
    this.tabUpcoming = page.getByText("Upcoming", { exact: true });
    this.tabCompleted = page.getByText("Completed", { exact: true });
    this.tabCancelled = page.getByText("Cancelled", { exact: true });

    // filter component
    this.inputSearch = page.getByPlaceholder("Search by Event Title");
    this.inputParticipantType = page.getByRole("combobox");
    // calendar component
    this.filterCalendar = page.getByRole("textbox", {
      name: "Select Date Range",
    });
    // @filterCalendarYear
    // component: input
    // type: number (2023)
    this.calendarYear = page.locator("input.numInput.cur-year");
    // @filterCalendarMonth
    // component: dropdown
    // type: string ("1")
    this.calendarMonth = page.locator("select.flatpickr-monthDropdown-months");
    this.calendarDate = page.locator(
      `span.flatpickr-day[aria-label$='${selectedDate}']`
    );

    // sorting component
    this.cellDate = page.getByRole("gridcell", {
      name: "Date",
    });
    this.cellTime = page.getByRole("gridcell", {
      name: "Time",
    });
    this.cellBookingDeadline = page.getByRole("gridcell", {
      name: "Booking Deadline",
    });
    this.cellEvent = page.getByRole("gridcell", {
      name: "Event",
    });
    this.cellHost = page.getByRole("gridcell", {
      name: "Host",
    });
    this.cellParticipant = page.getByRole("gridcell", {
      name: "Participant",
    });
    this.cellTargetAttendees = page.getByRole("gridcell", {
      name: "Target Attendees",
      exact: true,
    });
    this.cellCapacity = page.getByRole("gridcell", {
      name: "Capacity",
    });

    this.inputCalendar = page.getByRole("textbox", {
      name: "Select Date Range",
    });
    // @filterCalendarYear
    // component: input
    // type: number (2023)
    this.calendarYear = page.locator("input.numInput.cur-year");
    // @filterCalendarMonth
    // component: dropdown
    // type: string ("1")
    this.calendarMonth = page.locator("select.flatpickr-monthDropdown-months");
    this.calendarDate = page.locator(
      `span.flatpickr-day[aria-label$='${selectedDate}']`
    );
  }

  async goTo() {
    await this.page.goto(this.url);
  }

  async filterDateRange(year, month, day) {
    const startDate = `${monthNames[month - 1]} ${day - 1}, ${year}`;
    const endDate = `${monthNames[month - 1]} ${day}, ${year}`;

    console.log(startDate);
    console.log(endDate);

    await this.filterCalendar.click();
    await this.calendarYear.click();
    await this.calendarYear.fill(`${year}`);
    // await this.calendarMonth.click();
    await this.calendarMonth.selectOption((month - 1).toString());

    selectedDate = startDate;
    await this.page
      .locator(`span.flatpickr-day[aria-label$='${selectedDate}']`)
      .click();

    selectedDate = endDate;
    await this.page
      .locator(`span.flatpickr-day[aria-label$='${selectedDate}']`)
      .click();
  }

  async deleteEvents() {
    const totalRow = await this.page.locator("tbody tr").count();

    const residentRowIndex = faker.number.int({
      min: 0,
      max: totalRow - 1,
    });

    const eventName = await this.page
      .locator("tbody tr")
      .nth(residentRowIndex)
      .locator("td")
      .nth(3)
      .innerText();

    console.log(eventName);

    await this.page
      .locator("tbody tr")
      .nth(residentRowIndex)
      .locator("td")
      .nth(8)
      .locator("i.vsf_table_trash_color")
      .click();

    await wait(500);
    await this.confirmButton.click();
  }

  async viewDetails() {
    const totalRow = await this.page.locator("tbody tr").count();

    const residentRowIndex = faker.number.int({
      min: 0,
      max: totalRow - 1,
    });

    const eventName = await this.page
      .locator("tbody tr")
      .nth(residentRowIndex)
      .locator("td")
      .nth(3)
      .innerText();

    console.log(eventName);

    await this.page
      .locator("tbody tr")
      .nth(residentRowIndex)
      .locator("td")
      .nth(8)
      .locator("i.icon-fi-rr-eye")
      .click();

    await expect(this.page).toHaveTitle("EventView");
  }

  async filterDateRange(year, month, day) {
    const startDate = `${monthNames[month - 1]} ${day - 1}, ${year}`;
    const endDate = `${monthNames[month - 1]} ${day}, ${year}`;

    console.log(startDate);
    console.log(endDate);

    await this.inputCalendar.click();
    await this.calendarYear.click();
    await this.calendarYear.fill(`${year}`);
    // await this.calendarMonth.click();
    await this.calendarMonth.selectOption((month - 1).toString());

    selectedDate = startDate;
    await this.page
      .locator(`span.flatpickr-day[aria-label$='${selectedDate}']`)
      .click();

    selectedDate = endDate;
    await this.page
      .locator(`span.flatpickr-day[aria-label$='${selectedDate}']`)
      .click();
  }

  async filterSearch(eventName) {
    if (eventName === "") {
      const totalRow = await this.page.locator("tbody tr").count();

      const residentRowIndex = faker.number.int({
        min: 0,
        max: totalRow - 1,
      });

      eventName = await this.page
        .locator("tbody tr")
        .nth(residentRowIndex)
        .locator("td")
        .nth(3)
        .innerText();
    }

    await this.inputSearch.click();
    await this.inputSearch.fill(eventName);
  }

  async filterParticipantType(participantType) {
    await this.inputParticipantType.selectOption(participantType);
  }
}
