import { expect } from '@playwright/test';

export class Menu {
  constructor(page) {
    this.page = page
  }

  async clickHomeMenu(staffName) {
    await this.page
      .locator('div.nok_footer_logo_cont')
      .filter({ hasText: 'Home' })
      .first()
      .click()
    await expect(this.page.locator('div.hp_top_links_name span')).toContainText(
      staffName
    )
  }

  async clickPostMenu() {
    await this.page
      .locator('div.nok_footer_logo_cont')
      .filter({ hasText: 'Post' })
      .first()
      .click()
  }

  async clickInboxMenu() {
    await this.page
      .locator('div.nok_footer_logo_cont')
      .filter({ hasText: 'Inbox' })
      .first()
      .click()
  }

  async clickEventsMenu() {
    await this.page
      .locator('div.nok_footer_logo_cont')
      .filter({ hasText: 'Events' })
      .first()
      .click()
  }

  async clickPortfolioMenu() {
    await this.page
      .locator('div.nok_footer_logo_cont')
      .filter({ hasText: 'Portfolio' })
      .first()
      .click()
  }
}
