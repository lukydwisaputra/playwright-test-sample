import { wait } from "../../../utils/time";
import { expect } from "@playwright/test";

export class Homepage {
  constructor(page) {
    this.page = page;
    this.counter = 0;
    this.maxRecord = 4;
  }

  async expectPostToBe(expected) {
    let postCount = await this.page.locator("div.vsf_vp_main_con").count();
    expect(postCount).toBe(expected);
  }

  async expectPostToBeTruthy() {
    this.counter++;
    await wait(1000);
    let postCount = await this.page.locator("div.vsf_vp_main_con").count();
    expect(
      postCount >= this.maxRecord || postCount <= this.maxRecord * this.counter
    ).toBeTruthy();
  }

  async clickLoadMore() {
    await this.page.getByRole("button", { name: "Load More" }).click();
  }
}
