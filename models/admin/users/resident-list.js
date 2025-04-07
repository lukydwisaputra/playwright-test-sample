import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { wait } from "../../../utils/time";

export class ResidentList {
  constructor(page) {
    // common component
    this.page = page;
    this.url = "https://outtst.werkdone.com/NOKAdmin/Users";

    this.inputSearch = page.getByPlaceholder("Search by Name");
  }

  async goTo() {
    await this.page.goto(this.url);
    await expect(this.page).toHaveTitle("Users");
  }

  async clickDetails() {
    await this.page
      .locator("tbody tr")
      .nth(faker.number.int({ min: 0, max: 7 }))
      .locator("td")
      .nth(8)
      .locator("i.icon-fi-rr-eye")
      .click();

    await wait(1000);
  }

  async clickSelectedDetails(selectedRow) {
    await this.page
      .locator("tbody tr")
      .nth(selectedRow)
      .locator("td")
      .nth(8)
      .locator("i.icon-fi-rr-eye")
      .click();

    await wait(1000);
  }

  async filterSearch(residentName) {
    await this.inputSearch.click();
    await this.inputSearch.fill(residentName);
  }
}
