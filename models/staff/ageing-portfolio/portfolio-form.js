import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { wait } from "../../../utils/time";

const day = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  return String(
    Math.floor(Math.random() * (lastDayOfMonth - currentDay)) + currentDay
  ).padStart(2, "0");
};
const month = String(new Date().getMonth() + 1).padStart(2, "0");
const year = new Date().getFullYear();
const selectedDate = `${year}-${month}-${day()}`;
let selectedResident = "";

export class PortfolioForm {
  constructor(page) {
    this.page = page;
    this.nextButton = page.getByRole("button", { name: "Next" });
    this.editButton = page.getByRole("button", { name: "Edit" });
    this.submitButton = page.getByRole("button", { name: "Submit" });

    this.albumType = faker.number.int({ min: 0, max: 4 }).toString();
    this.inputAlbum = page.getByLabel("Album");

    this.inputActivityDate = page.locator("#b2-b1-Input_ActivityDate");
    this.inputResident = page.locator(".vscomp-toggle-button");

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
    this.alert = page.locator("div.feedback-message-text");
  }

  async fillAlbumType() {
    await this.inputAlbum.click();
    await this.inputAlbum.selectOption(this.albumType);
  }

  async fillActivityDate() {
    console.log(selectedDate);
    await this.inputActivityDate.fill(selectedDate);
  }

  async fillResident() {
    await this.inputResident.click();
    selectedResident = await this.page
      .locator(".vscomp-option-text")
      .nth(faker.number.int({ min: 0, max: 9 }))
      .innerText();

    console.log(selectedResident);
    await this.page
      .getByRole("option", {
        name: selectedResident,
      })
      .first()
      .click();
  }

  async uploadImage() {
    let totalImageUploaded = faker.number.int({ min: 1, max: 10 });
    for (let i = 0; i < totalImageUploaded; i++) {
      await this.page
        .locator("input")
        .setInputFiles(this.imageList[faker.number.int({ min: 0, max: 10 })]);

      await wait(500);
    }

    expect(await this.page.locator("div.PWIm_image_Cont").count()).toBe(
      totalImageUploaded
    );
  }

  async uploadImageCountLimit() {
    for (let i = 0; i < 11; i++) {
      await this.page
        .locator("input")
        .setInputFiles(this.imageList[faker.number.int({ min: 0, max: 10 })]);

      await wait(500);
    }

    expect(await this.page.locator("div.PWIm_image_Cont").count()).toBe(10);
    await expect(this.alert).toBeVisible();
    await expect(this.alert).toContainText(
      "The maximum number of attachments allowed is 10."
    );
  }

  async isNextButtonDisabled() {
    await expect(
      this.page.getByRole("button", { name: "Next" })
    ).toBeDisabled();
  }

  async uploadImageSizeLimit() {
    await this.page.locator("input").setInputFiles(this.bigimage);
    await wait(2_000);
    await expect(this.alert).toBeVisible();
    await expect(this.alert).toContainText(
      "The file is too large to upload, please re-upload."
    );
  }

  async resetInputImage() {
    let totalUploadedImage = await this.page
      .locator("div.PWIm_image_Cont")
      .count();
    for (let i = 0; i < totalUploadedImage; i++) {
      await this.page.locator(".PWIm_CloseIconSize").first().click();
      // await this.page.getByRole('button', { name: 'Confirm' }).click()
      await wait(100);
    }
  }

  async checkInputOnEdit() {
    await expect(this.inputAlbum).toHaveValue(this.albumType);
    // await this.input.toHaveValue(selectedDate)
    // console.log(await this.inputAlbum.value())
    await expect(this.inputActivityDate).toHaveValue(selectedDate);
    expect(
      (await this.page.locator(".vscomp-value-tag").innerText()) ==
        selectedResident
    ).toBeTruthy();
  }

  async checkImageOnEdit() {
    await expect(this.page.locator("div.PWIm_Description1")).toBeVisible();
  }

  async isSuccess() {
    await expect(await this.page.locator("div span.PostApp_T1")).toContainText(
      "Portfolio Entry Submitted"
    );
  }

  async isNextButtonDisabled() {
    await expect(this.nextButton).toBeDisabled();
  }
}
