import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

export class PortfolioApproval {
  constructor(page) {
    // common component
    this.page = page;
    this.url = "https://outtst.werkdone.com/NOKAdmin/PortfolioList";

    // button component
    this.paginationNext = page.getByLabel("go to next page");
    this.paginationPrevious = page.getByLabel("go to previous page");

    this.approveButton = page.getByRole("button", { name: "Approve" });
    this.rejectButton = page.getByRole("button", { name: "Reject" });
    this.editButton = page.getByRole("button", { name: "Edit" });

    this.confirmButton = page.getByRole("button", { name: "Confirm" });

    this.inputRemarks = page.getByRole("textbox");

    // filter Component
    this.inputSearch = page.getByPlaceholder("Search by Resident");
    this.inputAlbum = page
      .locator("#b5-b2-PostType-container")
      .getByRole("combobox");
    this.inputStatus = page
      .locator("#b5-b2-PostStatus-container")
      .getByRole("combobox");

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
    await this.page.getByText("Portfolio Approval").click();
  }

  async filterSearch(residentName) {
    await this.inputSearch.click();
    await this.inputSearch.fill(residentName);
  }

  async filterAlbum(albumType) {
    await this.inputAlbum.selectOption(albumType);
  }

  async filterStatus(status) {
    await this.inputStatus.selectOption(status);
  }

  async countTableRowToBe(expectedCount) {
    expect(await this.tableRow.count()).toBe(expectedCount);
  }

  async fillRemarks() {
    await this.inputRemarks.click();
    await this.inputRemarks.fill(faker.lorem.sentence());
  }

  async clickSelectedDetails(selectedRow) {
    await this.page
      .locator("tbody tr")
      .nth(selectedRow)
      .locator("td")
      .nth(6)
      .locator("i.icon-fi-rr-eye")
      .click();

    await expect(this.page).toHaveTitle("PortfolioView");
  }

  async clickDetails() {
    await this.page
      .locator("tbody tr")
      .nth(faker.number.int({ min: 0, max: 7 }))
      .locator("td")
      .nth(6)
      .locator("i.icon-fi-rr-eye")
      .click();

    await expect(this.page).toHaveTitle("PortfolioView");
  }
}
