import { test, expect, devices } from '@playwright/test'
import { Admin } from '../../models/admin/common/admin'
import { MyPosts } from '../../models/admin/social-feeds/my-posts'
import { PostForm } from '../../models/admin/social-feeds/post-form'
import { wait } from '../../utils/time'

let page
let admin

test.use({
  headless: true,
})

// Hooks
test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext()
  page = await context.newPage()

  admin = new Admin(page)
  await admin.login()
})

test.afterAll(async () => {
  await admin.logout()
})

// Test
test('US2: Create Social Feed Post', async () => {
  const adminMyPosts = new MyPosts(page)
  const adminPostForm = new PostForm(page)
  const isRequiresNOKAck = false

  await test.step('US2-a1. Post Submission Form', async () => {
    await test.step('go to admin post list', async () => {
      await adminMyPosts.goto()
    })

    await test.step('go to create post form', async () => {
      await adminMyPosts.createPostClick()
    })

    await test.step('US2-r1. Empty Input on Post Submission Form', async () => {
      await adminPostForm.clickNext()
      await adminPostForm.isError()
    })

    await test.step('fill text post details without NOK acknowledgement', async () => {
      await adminPostForm.fillTextDetails(isRequiresNOKAck)
      await adminPostForm.clickNext()
    })

    await test.step('skip upload image', async () => {
      await adminPostForm.clickNext()
    })

    await test.step('US2-a2. Edit Post Creation', async () => {
      await adminPostForm.clickEdit()
      await adminPostForm.checkInputOnEdit(isRequiresNOKAck)

      await adminPostForm.clickNext()
      await adminPostForm.clickNext()
    })

    await test.step('US2-a3. Successful Post Creation', async () => {
      await adminPostForm.clickPublish()
      await adminPostForm.isSuccess()
    })
  })
})

test('US4: Request for Acknowledgement', async () => {
  const adminMyPosts = new MyPosts(page)
  const adminPostForm = new PostForm(page)
  const isRequiresNOKAck = true

  await test.step('post submission form', async () => {
    await test.step('go to admin post list', async () => {
      await adminMyPosts.goto()
    })

    await test.step('go to create post form', async () => {
      await adminMyPosts.createPostClick()
    })

    await test.step('fill text post details with NOK acknowledgement', async () => {
      await adminPostForm.fillTextDetails(isRequiresNOKAck)
      await adminPostForm.clickNext()
    })

    await test.step('skip upload image', async () => {
      await adminPostForm.clickNext()
    })

    await test.step('edit Post Creation', async () => {
      await adminPostForm.checkAcknowledgement()
    })
  })
})

test('US5: Social Feed Post Approval', async () => {
  const adminMyPosts = new MyPosts(page)
  let postTitle

  await test.step('US5-a1 Post Approval', async () => {
    await test.step('go to admin post list', async () => {
      await adminMyPosts.goto()
    })

    await test.step('go to post approval screen', async () => {
      await adminMyPosts.clickPostApproval()
    })

    await test.step('filter table by pending post', async () => {
      await adminMyPosts.filterPendingPost()
    })

    await test.step('open post details', async () => {
      await wait(500)
      postTitle = await adminMyPosts.getFirstPostTitle()
      await adminMyPosts.clickDetails()
      await adminMyPosts.checkDetailTitle(postTitle)
    })

    await test.step('approve pending post', async () => {
      await adminMyPosts.clickApprove()
      await adminMyPosts.clickConfirm()
      await adminMyPosts.isApproved()
    })

    await test.step('check approved', async () => {
      await wait(500)
      await adminMyPosts.clickBackButton()
      await adminMyPosts.searchPostByTitle(postTitle)
    })

    await test.step('US5-r1 No Record Found on Search Name Filter', async () => {
      await adminMyPosts.searchPostByTitle('asdfpoiuyt')
    })
  })

  await test.step('US5-a2 Post Rejection', async () => {
    await test.step('go to admin post list', async () => {
      await adminMyPosts.goto()
    })

    await test.step('go to post approval screen', async () => {
      await adminMyPosts.clickPostApproval()
    })

    await test.step('filter table by pending post', async () => {
      await adminMyPosts.filterPendingPost()
    })

    await test.step('open post details', async () => {
      await wait(500)
      postTitle = await adminMyPosts.getFirstPostTitle()
      await adminMyPosts.clickDetails()
      await adminMyPosts.checkDetailTitle(postTitle)
    })

    await test.step('reject pending post', async () => {
      await adminMyPosts.clickReject()
      await adminMyPosts.clickConfirm()
      await adminMyPosts.isRejected()
    })

    await test.step('check approved', async () => {
      await wait(500)
      await adminMyPosts.clickBackButton()
      await adminMyPosts.clickPostApproval()
      // await adminMyPosts.searchPostByTitle(postTitle)
      await wait(500)
    })

    await test.step('US5-a5 Filtering', async () => {
      await adminMyPosts.checkFilter()
    })
  })
})

test('US6: Create Social Feed Post with Photos', async () => {
  const adminMyPosts = new MyPosts(page)
  const adminPostForm = new PostForm(page)
  const isRequiresNOKAck = true

  await test.step('US6-a1 Post Submission Form', async () => {
    await test.step('go to admin post list', async () => {
      await adminMyPosts.goto()
    })

    await test.step('go to create post form', async () => {
      await adminMyPosts.createPostClick()
    })

    await test.step('fill text post details without NOK acknowledgement', async () => {
      await adminPostForm.fillTextDetails(isRequiresNOKAck)
      await adminPostForm.clickNext()
    })

    await test.step('US6-r2 Maximum Attachment Limit Enforcement', async () => {
      await adminPostForm.uploadImageCountLimit()
      await adminPostForm.resetInputImage()
    })

    await test.step('US6-r1. Photo Size Limit Enforcement', async () => {
      await adminPostForm.uploadImageSizeLimit()
    })

    await test.step('upload image(s)', async () => {
      await adminPostForm.uploadImage()
      await adminPostForm.clickNext()
    })

    await test.step('US6-a2. Edit Post Creation', async () => {
      await adminPostForm.clickEdit()
      await adminPostForm.checkInputOnEdit(isRequiresNOKAck)

      await adminPostForm.clickNext()
      await adminPostForm.clickNext()
    })

    await test.step('US2-a3. Successful Post Creation', async () => {
      await adminPostForm.clickPublish()
      await adminPostForm.isSuccess()
    })
  })
})

test('US12: Save Social Feed Draft', async () => {
  const adminMyPosts = new MyPosts(page)
  const adminPostForm = new PostForm(page)
  const isRequiresNOKAck = false

  await test.step('go to admin post list', async () => {
    await adminMyPosts.goto()
  })

  await test.step('go to create post form', async () => {
    await adminMyPosts.createPostClick()
  })

  await test.step('fill text post details without NOK acknowledgement', async () => {
    await adminPostForm.fillTextDetails(isRequiresNOKAck)
    await adminPostForm.clickNext()
  })

  await test.step('click save as draft button', async () => {
    await adminPostForm.clickSaveAsDraft()
    await adminMyPosts.clickMyPost()
    await adminMyPosts.checkDraftList()
  })
})

test('US15: View Social Feed (Admin)', async () => {
  const adminMyPosts = new MyPosts(page)

  await test.step('go to admin post list', async () => {
    await adminMyPosts.goto()
  })

  await test.step('US15-a1 Displaying Announcements/News/Upcoming Activities', async () => {
    await adminMyPosts.checkTableContent()
  })

  await test.step('US15-a5 No Post Available', async () => {
    await adminMyPosts.searchPostByTitle('asdfpoiuyt')
    await expect(page.getByText('No records found...')).toBeVisible()
  })
})
