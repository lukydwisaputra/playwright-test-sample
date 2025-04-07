import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { wait } from "../../../utils/time";

export class PostForm {
  constructor(page) {
    this.page = page;
    this.title = faker.lorem.sentence();
    this.type = faker.number.int({ min: 0, max: 2 }).toString();
    this.body = faker.lorem.paragraphs(3);
    this.link = faker.internet.url();
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
    this.bigimage = "images/bigimage.jpg";
  }

  async fillTextDetails(isRequiresNOKAck) {
    await this.page.getByLabel("Post Type").selectOption(this.type);
    await this.page.getByPlaceholder("Enter Title").click();
    await this.page.getByPlaceholder("Enter Title").fill(this.title);
    await this.page.getByPlaceholder("Enter your post").click();
    await this.page.getByPlaceholder("Enter your post").fill(this.body);
    await this.page.getByPlaceholder("Insert External Link").click();
    await this.page.getByPlaceholder("Insert External Link").fill(this.link);

    if (isRequiresNOKAck) {
      await this.page.locator("input.checkbox").check();
      await expect(this.page.locator("input.checkbox")).toBeChecked();
    }
  }

  async fillEmptyTextDetails() {
    await this.page.getByLabel("Post Type").selectOption("-1");
    await this.page.getByPlaceholder("Enter Title").click();
    await this.page.getByPlaceholder("Enter Title").fill("");
    await this.page.getByPlaceholder("Enter your post").click();
    await this.page.getByPlaceholder("Enter your post").fill("");
    await this.page.getByPlaceholder("Insert External Link").click();
    await this.page.getByPlaceholder("Insert External Link").fill("");
  }

  async clickNext() {
    await this.page.getByRole("button", { name: "Next" }).click();
  }

  async clickSubmit() {
    await this.page.getByRole("button", { name: "Submit" }).click();
  }

  async clickEdit() {
    await this.page.getByRole("button", { name: "Edit" }).click();
  }

  async checkInputOnEdit(isRequiresNOKAck) {
    await expect(this.page.getByLabel("Post Type")).toHaveValue(this.type);
    await expect(this.page.getByPlaceholder("Enter Title")).toHaveValue(
      this.title
    );
    await expect(this.page.getByPlaceholder("Enter your post")).toHaveValue(
      this.body
    );
    await expect(
      this.page.getByPlaceholder("Insert External Link")
    ).toHaveValue(this.link);

    if (isRequiresNOKAck) {
      await expect(this.page.locator("input.checkbox")).toBeChecked();
    }
  }

  async checkImageOnEdit() {
    await expect(this.page.locator("div.PWIm_Description1")).toBeVisible();
  }

  async checkAcknowledgement() {
    await expect(
      this.page.locator("#b6-b2-b1-Notrequiredacknowledgement")
    ).toBeVisible();
    await expect(
      this.page.locator("#b6-b2-b1-Notrequiredacknowledgement")
    ).toContainText("Required acknowledgement");
  }

  async uploadImage() {
    let totalImageUploaded = faker.number.int({ min: 1, max: 10 });
    for (let i = 0; i < totalImageUploaded; i++) {
      await this.page
        .locator("input")
        .setInputFiles(this.imageList[faker.number.int({ min: 0, max: 10 })]);

      await wait(500);
    }

    expect(await this.page.locator("img.PWIm_image").count()).toBe(
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

    expect(await this.page.locator("img.PWIm_image").count()).toBe(10);
    await expect(this.page.locator("div.feedback-message-text")).toBeVisible();
    await expect(this.page.locator("div.feedback-message-text")).toContainText(
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
    await expect(this.page.locator("div.feedback-message-text")).toBeVisible();
    await expect(this.page.locator("div.feedback-message-text")).toContainText(
      "The file is too large to upload, please re-upload."
    );
  }

  async resetInputImage() {
    let totalUploadedImage = await this.page.locator("img.PWIm_image").count();
    for (let i = 0; i < totalUploadedImage; i++) {
      await this.page.locator(".PWIm_CloseIconSize").first().click();
      await this.page.getByRole("button", { name: "Confirm" }).click();
      await wait(100);
    }
  }

  async isSuccess() {
    await expect(this.page.locator("div span.PostApp_T1")).toContainText(
      "Post Submitted"
    );
  }

  async isError() {
    await expect(this.page.getByRole("alert")).toBeVisible();
    await expect(this.page.getByRole("alert")).toContainText(
      "Failed to save changes, please check required fields."
    );
  }

  async clickSaveAsDraft() {
    await this.page.getByRole("button", { name: "Save as Draft" }).click();
  }

  async clickConfirm() {
    await this.page.getByRole("button", { name: "Confirm" }).click();
  }

  async clickBackToHomepage() {
    await this.page.getByRole("button", { name: "Back to Homepage" }).click();
  }
}
