import { wait } from '../../../utils/time'
import { expect } from "@playwright/test";

export class Homepage {
  constructor(page) {
    this.page = page
    this.counter = 0
    this.maxRecord = 4
    
    
  }

  async expectPostToBe(expected) {
    await wait(2_000)
    let postCount = await this.page.locator('div.vsf_vp_main_con').count()
    expect(postCount).toBe(expected)
  }

  async openFirstPost() {
    let firstPost = await this.page.locator('div.vsf_vp_main_con').first()
    let firsPostTitle = await firstPost
      .locator('span.vsf_vp_cont_post_title')
      .innerText()
    await firstPost.click()

    let postDetailTitle = await this.page.locator('#b3-PostTitle').innerText()
    expect(postDetailTitle).toBe(firsPostTitle)
  }

  async expectPostToBeTruthy() {
    this.counter++
    await wait(1000)
    let postCount = await this.page.locator('div.vsf_vp_main_con').count()
    expect(
      postCount >= this.maxRecord || postCount <= this.maxRecord * this.counter
    ).toBeTruthy()
  }

  async clickLoadMore() {
    await wait(500)
    await this.page.getByRole('button', { name: 'Load More' }).click()
  }
}
