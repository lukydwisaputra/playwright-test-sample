import { wait } from "../../../utils/time";
import { expect } from "@playwright/test";

export class Portfolio {
  constructor(page) {
    this.page = page;

    this.inputSearch = page.getByPlaceholder("Search by resident name");
    this.loadMoreButton = page.getByRole("link", { name: "Load More" });

    this.cardItems = page.locator(".Res_card_Cont");
    this.timelineItems = page.locator(".vsf_vp_postImagegrid_list_img");

    this.tabAlbum = page.getByText("Album", { exact: true });
    this.albumItems = page.locator(".pfo_al_Card_image");
  }

  async expectPostToBe(expected) {
    let postCount = await this.page.locator("div.vsf_vp_main_con").count();
    expect(postCount).toBe(expected);
  }

  async clickLoadMore() {
    await this.loadMoreButton.click();
  }
}
