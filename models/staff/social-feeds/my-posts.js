import { wait } from "../../../utils/time";
import { expect } from "@playwright/test";

export class MyPosts {
  constructor(page) {
    this.page = page;
  }

  async clickCreatePost() {
    await this.page.getByRole("button", { name: "Create Post" }).click();
  }

  async clickDraft() {
    await this.page.locator("div#b2-PostApproval").click();
  }

  async clickLoadMore() {
    expect(
      await this.page.getByRole("link", { name: "Load More" })
    ).toBeVisible();
    await this.page.getByRole("link", { name: "Load More" }).click();
  }

  async checkDraftList(postTitle) {
    await expect(
      this.page.locator(".list").first().locator(".mypost_status").first()
    ).toContainText("Draft");
    await expect(
      this.page.locator(".list").first().locator(".mypost_title").first()
    ).toContainText(postTitle);
  }

  async checkMenuButton() {
    expect(
      await this.page.locator("button span.mypost_main_button_text").count()
    ).toBe(4);
  }

  async clickPendingButton() {
    await this.page
      .locator("button span.mypost_main_button_text")
      .nth(2)
      .click();
  }

  async clickRejectedButton() {
    await this.page
      .locator("button span.mypost_main_button_text")
      .nth(3)
      .click();
  }

  async openFirstPost() {
    await this.page
      .locator(".list")
      .first()
      .locator(".mypost_status")
      .first()
      .click();
  }

  async clickEditButton() {
    await this.page.getByRole("button", { name: "Edit" }).click();
  }
}
