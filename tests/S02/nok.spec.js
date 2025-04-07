import { test, expect, devices } from '@playwright/test'
import { NOK } from '../../models/nok/common/nok'
import { Homepage } from '../../models/nok/common/homepage'
import { wait } from '../../utils/time'

let page
let nok

test.use({
  ...devices['iPhone 15'],
  isMobile: true,
  headless: true,
})

// Hooks
test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext()
  page = await context.newPage()

  nok = new NOK(page)
  await nok.login()
})

test.afterAll(async () => {
  await nok.logout() 
})

test('US8: View Social Feed (NOK)', async () => {
  const NOKHomepage = new Homepage(page)

  await test.step('US-a1 Displaying Announcements/News/Upcoming Activities', async () => {
    await NOKHomepage.expectPostToBe(4)
  })

  await test.step('US1-a3 Load More Functionality', async () => {
    await NOKHomepage.clickLoadMore()
    await NOKHomepage.expectPostToBeTruthy()
  })

  await test.step('US-a2 Displaying Announcements/News/Upcoming Activities Details', async () => {
    await NOKHomepage.openFirstPost()
  })
})
