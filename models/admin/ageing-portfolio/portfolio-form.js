import { wait } from "../../../utils/time";
import { faker } from "@faker-js/faker";
import { expect } from "@playwright/test";

const day = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  return Math.floor(Math.random() * (lastDayOfMonth - currentDay)) + currentDay;
};
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
const month = new Date().getMonth().toString();
const year = new Date().getFullYear();
const selectedDate = `${monthNames[month]} ${day()}, ${year}`;
let selectedResident = "";

export class PortfolioForm {
  constructor(page) {
    this.page = page;
    this.url =
      "https://outtst.werkdone.com/NOKAdmin/PortfolioDetail?PortfolioId=0&NOKGatewayUserId=0";
    this.portfolioUrl = "https://outtst.werkdone.com/NOKAdmin/PortfolioList";
    this.newEntryButton = page.getByRole("button", { name: "New Entry" });
    this.nextButton = page.getByRole("button", { name: "Next" }).nth(1);
    this.editButton = page.getByRole("button", { name: "Edit" }).nth(1);
    this.publishButton = page.getByRole("button", { name: "Publish" }).nth(1);

    this.inputCalendar = page.getByRole("textbox", { name: "DD-MM-YY" });
    // @calendarYear
    // component: input
    // type: number (2023)
    this.calendarYear = page.locator("input.numInput.cur-year");
    // @calendarMonth
    // component: dropdown
    // type: string ("1") start from 0
    this.calendarMonth = page.locator("select.flatpickr-monthDropdown-months");
    this.calendarDate = page.locator(
      `span.flatpickr-day[aria-label$='${selectedDate}']`
    );
    this.inputAlbum = page.getByLabel("Album");
    this.albumType = faker.number.int({ min: 0, max: 4 }).toString();
    this.inputResident = page.locator("#b7-b1-b3-DropdownTags");
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

  async goTo() {
    await this.page.goto(this.portfolioUrl);
    await this.newEntryButton.click();
  }

  async fillAlbumType() {
    await this.inputAlbum.click();
    await this.inputAlbum.selectOption(this.albumType);
  }

  async fillActivityDate() {
    console.log(selectedDate);
    await this.inputCalendar.click();
    await this.calendarYear.click();
    await this.calendarYear.fill(`${year}`);
    await this.calendarMonth.click();
    await this.calendarMonth.selectOption(month);
    await this.calendarDate.click();
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
    await expect(this.alert).toBeVisible();
    await expect(this.alert).toContainText(
      "The maximum number of attachments allowed is 10."
    );
  }

  async uploadImageSizeLimit() {
    await this.page.locator("input").setInputFiles(this.bigimage);
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

  async resetInputImage() {
    let totalUploadedImage = await this.page.locator("img.PWIm_image").count();
    for (let i = 0; i < totalUploadedImage; i++) {
      await this.page.locator(".PWIm_CloseIconSize").first().click();
      await wait(100);
    }
  }

  async checkInputOnEdit() {
    await expect(this.inputAlbum).toHaveValue(this.albumType);
    // await this.input.toHaveValue(selectedDate)
    // console.log(await this.inputAlbum.value())
    expect(await this.calendarDate.getAttribute("aria-label")).toBe(
      selectedDate
    );
    expect(await this.page.locator(".vscomp-value-tag").innerText()).toBe(
      selectedResident
    );
  }

  async checkImageOnEdit() {
    await expect(this.page.locator("div.PWIm_Description1")).toBeVisible();
  }

  async isSuccess() {
    await expect(this.page.locator("div span.PostApp_T1")).toContainText(
      "Portfolio Entry Published"
    );
  }
}
