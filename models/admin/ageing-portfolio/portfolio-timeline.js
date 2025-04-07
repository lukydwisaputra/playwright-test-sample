import { expect } from "@playwright/test";

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

export class PortfolioTimeline {
  constructor(page) {
    // common component
    this.page = page;
    this.url = "https://outtst.werkdone.com/NOKAdmin/PortfolioList";

    // button component
    this.newEntryButton = page.getByRole("button", { name: "New Entry" });
    this.paginationNext = page.getByLabel("go to next page");
    this.paginationPrevious = page.getByLabel("go to previous page");

    // filter Component
    this.inputSearch = page.getByPlaceholder("Search by Resident");
    this.inputAlbum = page.locator("select#b5-b1-PostType");
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

    // blank state component
    this.noRecordsText = page.getByText("No records found...");

    // sorting component
    this.cellPublishedDate = page.getByRole("gridcell", {
      name: "Published Date",
    });
    this.cellActivityDate = page.getByRole("gridcell", {
      name: "Activity Date",
    });
    this.cellAuthor = page.getByRole("gridcell", { name: "Author" });
    this.cellAlbum = page.getByRole("gridcell", { name: "Album" });
    this.cellResident = page.getByRole("gridcell", {
      name: "Resident",
      exact: true,
    });
    this.tableRow = page.locator("tbody tr");
  }

  async goTo() {
    await this.page.goto(this.url);
  }

  async filterSearch(residentName) {
    await this.inputSearch.click();
    await this.inputSearch.fill(residentName);
  }

  async filterAlbum(albumType) {
    await this.inputAlbum.selectOption(albumType);
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

  async countTableRowToBe(expectedCount) {
    expect(await this.tableRow.count()).toBe(expectedCount);
  }

  async clickDetails() {
    await this.page
      .locator("tbody tr td")
      .nth(6)
      .locator("i.icon-fi-rr-eye")
      .click();

    await expect(this.page).toHaveTitle("PortfolioView");
  }
}
