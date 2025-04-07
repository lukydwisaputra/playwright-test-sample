import { wait } from '../../../utils/time'
import { expect } from "@playwright/test";

export class MyPosts {
  constructor(page) {
    this.page = page
    this.url = 'https://outtst.werkdone.com/NOKAdmin/PostList'
  }

  async goto() {
    await this.page.goto(this.url)
  }

  async createPostClick() {
    await this.page.getByRole('button', { name: 'Create Post' }).click()
    await expect(this.page.locator('div span.CSF_Header_Text')).toBeVisible()
  }

  async clickPostApproval() {
    await this.page.locator('#b5-PostApproval').click()
    await expect(
      this.page.locator('span.vsf_title_Breadscrum_icon_title')
    ).toBeVisible()
  }

  async clickMyPost() {
    await this.page.locator('#b5-MyPost').click()
    await expect(
      this.page.locator('span.vsf_title_Breadscrum_icon_title')
    ).toBeVisible()
  }

  async filterPendingPost() {
    await this.page
      .locator('#b5-b2-PostStatus-container')
      .getByRole('combobox')
      .selectOption('0')
  }

  async getFirstPostTitle() {
    const postTitle = await this.page
      .locator('table tbody tr')
      .first()
      .locator('td')
      .first()
      .innerText()
    console.log(postTitle)
    return postTitle
  }

  async clickDetails() {
    await this.page
      .locator('tbody tr td')
      .nth(8)
      .locator('i.icon-fi-rr-eye')
      .click()
  }

  async checkDetailTitle(postTitle) {
    await expect(this.page.locator('#b6-b2-b1-PostTitle')).toContainText(
      postTitle
    )
  }

  async clickApprove() {
    await this.page.getByRole('button', { name: 'Approve' }).click()
  }

  async clickReject() {
    await this.page.getByRole('button', { name: 'Reject' }).click()
    const remarksInput = await this.page.locator('#b6-b2-b2-b4-TextArea1')
    remarksInput.click()
    remarksInput.fill('Rejection Remarks')
  }

  async clickConfirm() {
    await this.page.getByRole('button', { name: 'Confirm' }).click()
  }

  async clickBackButton() {
    await this.page.locator('i.icon-fi-rr-arrow-small-left').click()
  }

  async searchPostByTitle(postTitle) {
    let searchInput = await this.page.getByPlaceholder('Search by Post Title')
    searchInput.click()
    searchInput.fill('')
    searchInput.fill(postTitle)
    await wait(1_000)

    let firstRowTitle
    if (postTitle == 'asdfpoiuyt') {
      expect(firstRowTitle == postTitle).toBeFalsy()
      return
    }

    firstRowTitle = await this.page
      .locator('table tbody tr')
      .first()
      .locator('td')
      .first()
      .innerText()

    expect(firstRowTitle == postTitle).toBeTruthy()
  }

  async checkFilter() {
    await this.searchPostByTitle('Contego valetudo vae sunt patior.')
    await this.page.locator('#b5-b2-PostType').selectOption('0')
    await this.page.locator('#b5-b2-PostStatus').selectOption('1')

    expect(
      await this.page
        .locator('table tbody tr')
        .first()
        .locator('td')
        .first()
        .count()
    ).toBe(1)

    expect(
      (await this.page
        .locator('table tbody tr')
        .first()
        .locator('td')
        .nth(1)
        .innerText()) == 'Announcement'
    ).toBeTruthy()

    expect(
      (
        await this.page
          .locator('table tbody tr')
          .first()
          .locator('td')
          .nth(7)
          .innerText()
      ).includes('Approved')
    ).toBeTruthy()
  }

  async isApproved() {
    await expect(this.page.locator('span.post_approve')).toBeVisible()
  }

  async isRejected() {
    await expect(this.page.locator('span.post_reject')).toBeVisible()
  }

  async checkDraftList() {
    const draftList = await this.page
      .locator('table tbody tr')
      .first()
      .locator('td')
      .nth(7)
      .innerText()

    expect(draftList == 'Draft').toBeTruthy()
  }

  async checkTableContent() {
    await wait(1000)
    await expect(this.page.locator('table tbody')).toBeVisible()
    expect(await this.page.locator('table tbody tr').count()).toBe(8)
  }
}
