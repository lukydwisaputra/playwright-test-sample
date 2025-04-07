import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { wait } from "../../../utils/time";

export class PortfolioEdit {
  constructor(page) {
    // common component
    this.page = page;

    this.inputImage = page.getByLabel("Add Photo");
    this.imageItems = page.locator("img.pfo_d_images_cover");
    this.imageCheckBox = page.locator("input.pfo_d_icon"); // action: check()
    this.selectAllImageCheckbox = page.locator("#b10-Checkbox2"); // action: check()

    this.deleteButton = page.getByRole("button", { name: "Delete" });
    this.approveButton = page.getByRole("button", { name: "Approve" });
    this.confirmButton = page.getByRole("button", { name: "Confirm" });

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
    this.alert = page.locator(".feedback-message-text");
  }

  async uploadSingleImage() {
    await this.page
      .locator("input")
      .setInputFiles(this.imageList[faker.number.int({ min: 0, max: 10 })]);
  }

  async uploadMultipleImage() {
    let totalImages = await this.imageItems.count();

    console.log(`Total Images: ${totalImages}`);
  }

  async uploadImageCountLimit() {
    for (let i = 0; i < 11; i++) {
      await this.inputImage.setInputFiles(
        this.imageList[faker.number.int({ min: 0, max: 10 })]
      );
      await wait(500);
    }

    expect(await this.imageItems.count()).toBe(10);
    await expect(this.alert).toBeVisible();
    await expect(this.alert).toContainText(
      "The maximum number of attachments allowed is 10."
    );
  }

  async uploadImageSizeLimit() {
    await this.inputImage.setInputFiles(this.bigimage);
    await wait(2_000);
    await expect(
      this.alert.filter({
        hasText: "The file is too large to upload, please re-upload.",
      })
    ).toBeVisible({ timeout: 10_000 });
    await expect(this.alert).toContainText(
      "The file is too large to upload, please re-upload."
    );
  }

  async deleteMultipleImage() {
    const deletedImage = faker.number.int({ min: 1, max: 5 });
    const totalImage = await this.imageItems.count();

    for (let i = 0; i < deletedImage; i++) {
      await wait(500);
      await this.imageCheckBox
        .nth(faker.number.int({ min: 0, max: totalImage - 1 }))
        .check();
    }

    await this.deleteButton.click();
  }
}
