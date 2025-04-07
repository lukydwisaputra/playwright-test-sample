import { test, expect, devices } from '@playwright/test'
import { Staff } from '../../models/staff/common/staff'
import { Menu } from '../../models/staff/common/menu'
import { MyPosts } from '../../models/staff/social-feeds/my-posts'
import { PostForm } from '../../models/staff/social-feeds/post-form'
import { wait } from '../../utils/time'
import { Homepage } from '../../models/staff/common/homepage'

test.use({
  ...devices['iPhone 15'],
  isMobile: true,
})

let page
let staff

// Hooks
test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext()
  page = await context.newPage()

  staff = new Staff(page)
  await staff.login()
})

test.afterAll(async () => {
  await staff.logout()
})

// Test
test('US1: View Social Feed & Homepage (Staff)', async () => {
  let staffHomepage = new Homepage(page)

  await test.step('US-a1 Displaying Announcements/News/Upcoming Activities', async () => {
    await staffHomepage.expectPostToBe(4)
  })

  await test.step('US1-a2 Load More Functionality', async () => {
    await staffHomepage.clickLoadMore()
    await staffHomepage.expectPostToBeTruthy()
  })
})

test('US3: Create Social Feed Post for Approval', async () => {
  const staffMenu = new Menu(page)
  const staffMyPosts = new MyPosts(page)
  const staffPostForm = new PostForm(page)
  const isRequiresNOKAck = false

  await test.step('US3-a1. Post Submission Form', async () => {
    await test.step('go to my posts screen', async () => {
      await staffMenu.clickPostMenu()
    })

    await test.step('go to create post form', async () => {
      await staffMyPosts.clickCreatePost()
    })

    await test.step('US3-r1 Next button disabled on empty input', async () => {
      await staffPostForm.isNextButtonDisabled()
    })

    await test.step('fill text post details without NOK acknowledgement', async () => {
      await staffPostForm.fillTextDetails()
      await staffPostForm.clickNext()
    })

    await test.step('skip upload image', async () => {
      await wait(500)
      await staffPostForm.clickNext()
    })

    await test.step('US3-a2. Edit Post Creation', async () => {
      await staffPostForm.clickEdit()
      await staffPostForm.checkInputOnEdit(isRequiresNOKAck)

      await staffPostForm.clickNext()
      await wait(500)
      await staffPostForm.clickNext()
    })

    await test.step('US3-a3. Successful Post Creation', async () => {
      await staffPostForm.clickSubmit()
      await staffPostForm.isSuccess()
    })
  })
})

test('US3-e1: Create Social Feed Post for Approval', async () => {
  const staffMenu = new Menu(page)
  const staffMyPosts = new MyPosts(page)
  const staffPostForm = new PostForm(page)
  const isRequiresNOKAck = true

  await test.step('US3-a1. Post Submission Form', async () => {
    await test.step('go to my posts screen', async () => {
      await staffMenu.clickPostMenu()
    })

    await test.step('go to create post form', async () => {
      await staffMyPosts.clickCreatePost()
    })

    await test.step('US3-r1 Next button disabled on empty input', async () => {
      await staffPostForm.isNextButtonDisabled()
    })

    await test.step('fill text post details without NOK acknowledgement', async () => {
      await staffPostForm.fillTextDetails(isRequiresNOKAck)
      await staffPostForm.clickNext()
    })

    await test.step('Maximum Attachment Limit Enforcement', async () => {
      await wait(500)
      await staffPostForm.uploadImageCountLimit()
      await staffPostForm.resetInputImage()
    })

    await test.step('Photo Size Limit Enforcement', async () => {
      await staffPostForm.uploadImageSizeLimit()
    })

    await test.step('upload image(s)', async () => {
      await staffPostForm.uploadImage()
      await staffPostForm.clickNext()
    })

    await test.step('US3-a2. Edit Post Creation', async () => {
      await staffPostForm.clickEdit()
      await staffPostForm.checkInputOnEdit(isRequiresNOKAck)

      await staffPostForm.clickNext()
      await wait(500)
      await staffPostForm.clickNext()
    })

    await test.step('US3-a3. Successful Post Creation', async () => {
      await staffPostForm.clickSubmit()
      await staffPostForm.isSuccess()
    })
  })
})

test('US12: Save Social Feed Draft', async () => {
  const staffMenu = new Menu(page)
  const staffMyPosts = new MyPosts(page)
  const staffPostForm = new PostForm(page)
  const isRequiresNOKAck = false

  await test.step('go to my posts screen', async () => {
    await staffMenu.clickPostMenu()
  })

  await test.step('go to create post form', async () => {
    await staffMyPosts.clickCreatePost()
  })

  await test.step('fill text post details without NOK acknowledgement', async () => {
    await staffPostForm.fillTextDetails(isRequiresNOKAck)
    await staffPostForm.clickNext()
  })

  await test.step('upload image(s)', async () => {
    await wait(1_000)
    await staffPostForm.uploadImage()
  })

  await test.step('click save as draft button', async () => {
    await staffPostForm.clickSaveAsDraft()
    await staffPostForm.clickConfirm()
    await staffMenu.clickPostMenu()
    await staffMyPosts.clickDraft()
    await staffMyPosts.checkDraftList(staffPostForm.title)
  })
})

test('US13: View Social Feed Pending/Approved/Rejected Posts', async () => {
  const staffMenu = new Menu(page)
  const staffMyPosts = new MyPosts(page)

  await test.step('go to my posts screen', async () => {
    await staffMenu.clickPostMenu()
  })

  await test.step('US13-a1 See menu button', async () => {
    await wait(500)
    await staffMyPosts.checkMenuButton()
    await staffMenu.clickHomeMenu(staff.name)
  })
})

test('US14-a1: Edit & Resubmit Pending/Rejected Post', async () => {
  const staffMenu = new Menu(page)
  const staffMyPosts = new MyPosts(page)
  const staffPostForm = new PostForm(page)
  const isRequiresNOKAck = true

  await test.step('go to my posts screen', async () => {
    await staffMenu.clickPostMenu()
  })

  await test.step('open first pending post', async () => {
    await staffMyPosts.clickPendingButton()
    await wait(500)
    await staffMyPosts.openFirstPost()
  })

  await test.step('click edit button', async () => {
    await wait(500)
    await staffMyPosts.clickEditButton()
  })

  await test.step('fill text post details without NOK acknowledgement', async () => {
    await staffPostForm.fillTextDetails(isRequiresNOKAck)
    await staffPostForm.clickNext()
  })

  await test.step('reset image(s)', async () => {
    await wait(2_000)
    await staffPostForm.resetInputImage()
  })

  await test.step('upload image(s)', async () => {
    await staffPostForm.uploadImage()
    await staffPostForm.clickNext()
  })

  await test.step('US3-a3. Successful Post Creation', async () => {
    await staffPostForm.clickSubmit()
    await staffPostForm.isSuccess()
    await staffPostForm.clickBackToHomepage()
  })
})

test('US14-a2 Edit Rejected Post', async () => {
  const staffMenu = new Menu(page)
  const staffMyPosts = new MyPosts(page)
  const staffPostForm = new PostForm(page)
  const isRequiresNOKAck = true

  await test.step('go to my posts screen', async () => {
    await staffMenu.clickPostMenu()
  })

  await test.step('open first rejected post', async () => {
    await staffMyPosts.clickRejectedButton()
    await wait(500)
    await staffMyPosts.openFirstPost()
  })

  await test.step('click edit button', async () => {
    await wait(500)
    await staffMyPosts.clickEditButton()
  })

  await test.step('fill text post details without NOK acknowledgement', async () => {
    await staffPostForm.fillTextDetails(isRequiresNOKAck)
    await staffPostForm.clickNext()
  })

  await test.step('reset image(s)', async () => {
    await wait(2_000)
    await staffPostForm.resetInputImage()
  })

  await test.step('upload image(s)', async () => {
    await staffPostForm.uploadImage()
    await staffPostForm.clickNext()
  })

  await test.step('US3-a3. Successful Post Creation', async () => {
    await staffPostForm.clickSubmit()
    await staffPostForm.isSuccess()
  })
})

test('US14-r1 Empty Input on Post Submission Form', async () => {
  const staffMenu = new Menu(page)
  const staffMyPosts = new MyPosts(page)
  const staffPostForm = new PostForm(page)
  const isRequiresNOKAck = true

  await test.step('go to my posts screen', async () => {
    await staffMenu.clickPostMenu()
  })

  await test.step('open first rejected post', async () => {
    await staffMyPosts.clickRejectedButton()
    await wait(500)
    await staffMyPosts.clickLoadMore()

    await wait(500)
    await staffMyPosts.openFirstPost()
  })

  await test.step('click edit button', async () => {
    await wait(500)
    await staffMyPosts.clickEditButton()
  })

  await test.step('fill empty text post details', async () => {
    await staffPostForm.fillEmptyTextDetails()
    await staffPostForm.isNextButtonDisabled()
  })
})
