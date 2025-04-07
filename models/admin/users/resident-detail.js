import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

export class ResidentDetails {
  constructor(page) {
    // common component
    this.page = page;
    this.url = "https://outtst.werkdone.com/NOKAdmin/ResidentDetails";

    // tab component
    this.tabPersonalInformation = page.getByRole("radio", {
      name: "Personal Information",
    });
    this.tabAdditionalInformation = page.getByRole("radio", {
      name: "Additional Information",
    });
    this.tabNOK = page.getByRole("radio", {
      name: "NOK",
    });
    this.tabNOK = page.getByRole("radio", {
      name: "Care Team",
    });
    this.tabNOK = page.getByRole("radio", {
      name: "Events",
    });
    this.tabAgeingPortfolio = page.getByRole("radio", {
      name: "Ageing Portfolio",
    });
    this.tabDocuments = page.getByRole("radio", {
      name: "Documents",
    });

    this.tabTimeline = page.getByText("Timeline");
    this.tabAlbums = page.locator("div").filter({ hasText: "Album" });
  }
}
