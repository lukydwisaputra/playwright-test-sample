import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

export class EventDetails {
  constructor(page) {
    // common component
    this.page = page;

    // button component
    this.addAttendeeButton = page.getByRole("button", { name: "Add Attendee" });

    // tab component
    this.tabAttendees = page.getByText("Attendees", { exact: true });
    this.tabDetails = page.getByText("Details", { exact: true });

    this.tabResident = page.getByText("Resident", { exact: true });
    this.tabNOK = page.getByText("NOK", { exact: true });

    this.inputSearch = page.getByPlaceholder("Search by resident name");
    this.inputBookingStatus = page.getByRole("combobox");
  }
}
