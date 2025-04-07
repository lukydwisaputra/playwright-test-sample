import { expect } from "@playwright/test";

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

export class Portfolio {
  constructor(page) {
    this.page = page;
    this.url = "https://outtst.werkdone.com/NOKgateway/SocialFeeds";
    this.newEntryButton = page.getByRole("button", { name: "New Entry" });

    this.filterAll = page.getByRole("button", { name: "All" });
    this.filterPublished = page.getByRole("button", { name: "Published" });
    this.filterPending = page.getByRole("button", { name: "Pending" });
    this.filterRejected = page.getByRole("button", { name: "Rejected" });
    this.loadMoreButton = page.getByRole("link", { name: "Load More" });

    this.editButton = page.getByRole("button", { name: "Edit" });
    this.nextButton = page.getByRole("button", { name: "Next" });
    this.deleteButton = page.getByRole("button", { name: "Delete" });
    this.submitButton = page.getByRole("button", { name: "Submit" });
    this.confirmButton = page.getByRole("button", { name: "Confirm" });

    this.filterHousehold = page.getByRole("button", {
      name: "Filter Household",
    });
    this.checkAllHousehold = page.getByRole("checkbox").nth(0); // action: Check
    this.confirmHousehold = page.getByRole("button", { name: "Confirm" });
    this.cancelHousehold = page.getByRole("button", { name: "Cancel" });
    this.checkHoushold = page.getByRole("checkbox"); // .nth(1) action: Check

    this.tabEntries = page.getByText("Entries");
    this.tabResidents = page.getByText("Residents");

    this.tabTimeline = page.getByText("Timeline", { exact: true });
    this.tabAlbum = page.getByText("Album", { exact: true });

    this.inputEntriesSearch = page.getByPlaceholder(
      "Search by Resident Name or"
    );
    this.inputResidentsSearch = page.getByPlaceholder(
      "Search by resident name"
    );
    this.emptyEntries = page.locator("#b2-Entries");
    this.emptyResidents = page.locator("#b2-Residents");

    this.entryItems = page.locator(".entry_cart_album_cont");
    this.residentItems = page.locator(".Res_card_Cont");

    this.imageItems = page.locator("div.PWIm_image_Cont").first();
    this.inputActivityDate = page.locator("#b2-b1-Input_ActivityDate");

    this.timelinePortfolioItems = page.locator(
      ".vsf_vp_postImagegrid-container"
    );

    this.AlbumPortfolioItems = page.locator(".pfo_al_Card_image_Cont");
    this.albumImageItems = page.locator(".PWIm_image");
  }

  async isNoRecords() {
    expect(await this.page.locator("#b2-Entries").textContent()).toContain(
      'Your portfolio is empty. Tap the "New Entry" button to create a portfolio entry.'
    );
  }

  async fillActivityDate() {
    console.log(selectedDate);
    await this.inputActivityDate.fill(selectedDate);
  }

  async isEmptyEntries() {
    await expect(await this.emptyEntries).toContainText(
      'Your portfolio is empty. Tap the "New Entry" button to create a portfolio entry.'
    );
  }

  async isEmptyResidents() {
    await expect(await this.emptyResidents).toContainText(
      "No Residents available to show."
    );
  }

  async isSuccess() {
    await expect(await this.page.locator("div span.PostApp_T1")).toContainText(
      "Portfolio Entry Submitted"
    );
  }
}
