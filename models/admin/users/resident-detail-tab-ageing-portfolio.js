import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { wait } from "../../../utils/time";

export class ResidentDetailsTabAgeingPortfolio {
  constructor(page) {
    // common component
    this.page = page;
    this.paginationNext = page.getByLabel("go to next page");
    this.paginationPrevious = page.getByLabel("go to previous page");
    this.loadMoreButton = page.getByRole("link", { name: "Load More" });
    this.deleteButton = page.getByRole("button", { name: "Delete" });
    this.confirmButton = page.getByRole("button", { name: "Confirm" });

    // sorting component
    this.cellPublishedDate = page.getByRole("gridcell", {
      name: "Published Date",
    });
    this.cellActivityDate = page.getByRole("gridcell", {
      name: "Activity Date",
    });
    this.cellAuthor = page.getByRole("gridcell", {
      name: "Author",
    });
    this.cellAlbum = page.getByRole("gridcell", {
      name: "Album",
    });
    this.cellResident = page.getByRole("gridcell", {
      name: "Resident",
      exact: true,
    });

    this.tabAlbum = page.locator("div#b9-Album").filter({ hasText: "Album" });
    this.albumItems = page.locator(".pfo_al_Card_image_Cont");
    this.imageCheckBox = page.locator("input.pfo_d_icon"); // action: check()

    this.imageItem = page.locator(".pfo_d_images");
    this.alert = page.getByRole("alert");
  }

  async openSelectedAlbum(albumIndex) {
    await this.albumItems.nth(albumIndex).click();
  }

  async deleteImage() {
    const initialTotalImage = await this.imageItem.count();

    await this.imageCheckBox
      .nth(faker.number.int({ min: 0, max: initialTotalImage - 1 }))
      .check();
    await this.deleteButton.click();
    await this.confirmButton.click();

    while (await this.loadMoreButton.isVisible()) {
      await this.loadMoreButton.click();
      await wait(500);
    }

    await wait(1000);
    await expect(this.alert).toContainText("Photo(s) deleted.");
  }
}
