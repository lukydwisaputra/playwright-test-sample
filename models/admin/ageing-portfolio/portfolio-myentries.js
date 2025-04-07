import { wait } from "../../../utils/time";
import { expect } from "@playwright/test";

export class PortfolioMyEntries {
  constructor(page) {
    // common component
    this.page = page;
    this.url = "https://outtst.werkdone.com/NOKAdmin/PortfolioList";
    this.myEntriesTab = page.locator("#b5-Header").getByText("My Entries");

    // button component
    this.newEntryButton = page.getByRole("button", { name: "New Entry" });
    this.paginationNext = page.getByLabel("go to next page");
    this.paginationPrevious = page.getByLabel("go to previous page");

    // filter Component
    this.inputSearch = page.getByPlaceholder("Search by Resident");
    this.inputAlbum = page.getByRole("combobox");

    // blank state component
    this.noRecordsText = page.getByText("No records found...");

    // sorting component
    this.cellPublishedDate = page.getByRole("gridcell", {
      name: "Published Date",
    });
    this.cellActivityDate = page.getByRole("gridcell", {
      name: "Activity Date",
    });
    this.cellAlbum = page.getByRole("gridcell", { name: "Album" });
    this.cellResident = page.getByRole("gridcell", {
      name: "Resident",
      exact: true,
    });
    this.cellStatus = page.getByRole("gridcell", {
      name: "Status",
      exact: true,
    });

    this.tableRow = page.locator("tbody tr");
  }

  async goTo() {
    await this.page.goto(this.url);
    await this.myEntriesTab.click();
    await wait(500);
  }

  async filterSearch(residentName) {
    await this.inputSearch.click();
    await this.inputSearch.fill(residentName);
  }

  async filterAlbum(albumType) {
    await this.inputAlbum.selectOption(albumType);
  }

  async countTableRowToBe(expectedCount) {
    await wait(1000);
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
