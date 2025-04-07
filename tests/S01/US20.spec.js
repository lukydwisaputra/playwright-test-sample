const { test, expect } = require('../Core/Core')

test.admin(
  'US20 [Admin to Resident] | Access Upload Documents Tab',
  async ({ page }, testInfo) => {
    await test.admin.step('Go to admin list', async () => {
      await page.goto('https://outtst.werkdone.com/NOKGateway_UI/Users')
    })

    let residentName
    await test.admin.step('Click View Details Action', async () => {
      residentName = await page
        .locator('tbody tr td')
        .nth(0)
        .locator('a.nok-text-link-primary')
        .innerText()
      await page
        .locator('tbody tr td')
        .nth(8)
        .locator('i.icon-fi-rr-eye')
        .click()
    })

    await test.admin.step(
      'Should be redirected to Resident Details Page',
      async () => {
        await expect(page).toHaveTitle('ResidentDetails')
        await expect(page.locator('#HeaderUserCard')).toContainText(
          residentName
        )
        await expect(page.locator('#b7-FullNameContainer')).toContainText(
          residentName
        )
      }
    )

    await test.admin.step('Go to Documents Tab', async () => {
      await page.getByRole('radio', { name: 'Documents' }).click()
    })

    await test.admin.step(
      'Upload document button should be visible',
      async () => {
        await expect(
          page.getByRole('button', { name: 'Upload Document' })
        ).toBeVisible()
      }
    )

    await test.admin.step(
      'Expect upload popup appear on the page',
      async () => {
        await page.getByRole('button', { name: 'Upload Document' }).click()
        await expect(page.getByRole('heading')).toContainText('Upload Document')
        await page.getByRole('button', { name: 'Cancel' }).click()
      }
    )
  }
)

test.admin(
  'US20 [Admin to Resident] | Upload a Valid PDF',
  async ({ page }, testInfo) => {
    await test.admin.step('Go to admin list', async () => {
      await page.goto('https://outtst.werkdone.com/NOKGateway_UI/Users')
    })

    let residentName
    await test.admin.step('Click View Details Action', async () => {
      residentName = await page
        .locator('tbody tr td')
        .nth(0)
        .locator('a.nok-text-link-primary')
        .innerText()
      await page
        .locator('tbody tr td')
        .nth(8)
        .locator('i.icon-fi-rr-eye')
        .click()
    })

    await test.admin.step(
      'Should be redirected to Resident Details Page',
      async () => {
        await expect(page).toHaveTitle('ResidentDetails')
        await expect(page.locator('#HeaderUserCard')).toContainText(
          residentName
        )
        await expect(page.locator('#b7-FullNameContainer')).toContainText(
          residentName
        )
      }
    )

    await test.admin.step('Go to Documents Tab', async () => {
      await page.getByRole('radio', { name: 'Documents' }).click()
    })

    await test.admin.step(
      'Upload document button should be visible',
      async () => {
        await expect(
          page.getByRole('button', { name: 'Upload Document' })
        ).toBeVisible()
      }
    )

    await test.admin.step(
      'Expect upload popup appear on the page',
      async () => {
        await page.getByRole('button', { name: 'Upload Document' }).click()
        await expect(page.getByRole('heading')).toContainText('Upload Document')
      }
    )

    await test.admin.step('Upload document with pdf format', async () => {
      await page
        .locator('#b9-Upload_Document')
        .setInputFiles('documents/exampledocs.pdf')
    })

    await test.admin.step('Save documents', async () => {
      await page.getByRole('button', { name: 'Save' }).click()
      await expect(page.getByRole('alert')).toContainText(
        'Record success message'
      )
      await expect(page.locator('tbody')).toContainText('exampledocs.pdf')
    })
  }
)

test.admin(
  'US20 [Admin to Resident] | Download Uploaded Documents',
  async ({ page }, testInfo) => {
    await test.admin.step('Go to admin list', async () => {
      await page.goto('https://outtst.werkdone.com/NOKGateway_UI/Users')
    })

    let residentName
    await test.admin.step('Click View Details Action', async () => {
      residentName = await page
        .locator('tbody tr td')
        .nth(0)
        .locator('a.nok-text-link-primary')
        .innerText()
      await page
        .locator('tbody tr td')
        .nth(8)
        .locator('i.icon-fi-rr-eye')
        .click()
    })

    await test.admin.step(
      'Should be redirected to Resident Details Page',
      async () => {
        await expect(page).toHaveTitle('ResidentDetails')
        await expect(page.locator('#HeaderUserCard')).toContainText(
          residentName
        )
        await expect(page.locator('#b7-FullNameContainer')).toContainText(
          residentName
        )
      }
    )

    await test.admin.step('Go to Documents Tab', async () => {
      await page.getByRole('radio', { name: 'Documents' }).click()
    })

    await test.admin.step(
      'Upload document button should be visible',
      async () => {
        await expect(
          page.getByRole('button', { name: 'Upload Document' })
        ).toBeVisible()
      }
    )

    await test.admin.step('Click Download button', async () => {
      await page
        .locator('tbody tr td')
        .nth(2)
        .locator('i.icon-fi-rr-download')
        .click()
    })
  }
)

test.admin(
  'US20 [Admin to Resident] | Delete an Uploaded Document',
  async ({ page }, testInfo) => {
    await test.admin.step('Go to admin list', async () => {
      await page.goto('https://outtst.werkdone.com/NOKGateway_UI/Users')
    })

    let residentName
    await test.admin.step('Click View Details Action', async () => {
      residentName = await page
        .locator('tbody tr td')
        .nth(0)
        .locator('a.nok-text-link-primary')
        .innerText()
      await page
        .locator('tbody tr td')
        .nth(8)
        .locator('i.icon-fi-rr-eye')
        .click()
    })

    await test.admin.step(
      'Should be redirected to Resident Details Page',
      async () => {
        await expect(page).toHaveTitle('ResidentDetails')
        await expect(page.locator('#HeaderUserCard')).toContainText(
          residentName
        )
        await expect(page.locator('#b7-FullNameContainer')).toContainText(
          residentName
        )
      }
    )

    await test.admin.step('Go to Documents Tab', async () => {
      await page.getByRole('radio', { name: 'Documents' }).click()
    })

    await test.admin.step(
      'Upload document button should be visible',
      async () => {
        await expect(
          page.getByRole('button', { name: 'Upload Document' })
        ).toBeVisible()
      }
    )

    let documentName
    await test.admin.step('Click Delete button', async () => {
      documentName = await page
        .locator('tbody tr td')
        .nth(0)
        .locator('a.nok-text-link-primary')
        .innerText()
      await page
        .locator('tbody tr td')
        .nth(2)
        .locator('i.icon-fi-rr-trash')
        .click()
    })

    console.log(documentName)

    await test.admin.step(
      'Delete confirmation popup should appear',
      async () => {
        await expect(page.getByRole('heading')).toContainText('Delete Document')
        // await expect(page.locator('#b9-Modal_DeleteDocument')).toContainText(
        //   documentName
        // )
      }
    )

    await test.admin.step('Confirm deletion', async () => {
      await page.getByRole('button', { name: 'Confirm' }).click()
      await expect(page.getByRole('alert')).toContainText(
        'Record success message'
      )
    })
  }
)

test.admin(
  'US20 [Admin to Resident] | File Size Exceeds Limit',
  async ({ page }, testInfo) => {
    await test.admin.step('Go to admin list', async () => {
      await page.goto('https://outtst.werkdone.com/NOKGateway_UI/Users')
    })

    let residentName
    await test.admin.step('Click View Details Action', async () => {
      residentName = await page
        .locator('tbody tr td')
        .nth(0)
        .locator('a.nok-text-link-primary')
        .innerText()
      await page
        .locator('tbody tr td')
        .nth(8)
        .locator('i.icon-fi-rr-eye')
        .click()
    })

    await test.admin.step(
      'Should be redirected to Resident Details Page',
      async () => {
        await expect(page).toHaveTitle('ResidentDetails')
        await expect(page.locator('#HeaderUserCard')).toContainText(
          residentName
        )
        await expect(page.locator('#b7-FullNameContainer')).toContainText(
          residentName
        )
      }
    )

    await test.admin.step('Go to Documents Tab', async () => {
      await page.getByRole('radio', { name: 'Documents' }).click()
    })

    await test.admin.step(
      'Upload document button should be visible',
      async () => {
        await expect(
          page.getByRole('button', { name: 'Upload Document' })
        ).toBeVisible()
      }
    )

    await test.admin.step(
      'Expect upload popup appear on the page',
      async () => {
        await page.getByRole('button', { name: 'Upload Document' }).click()
        await expect(page.getByRole('heading')).toContainText('Upload Document')
      }
    )

    await test.admin.step('Upload document with pdf format', async () => {
      await page
        .locator('#b9-Upload_Document')
        .setInputFiles('documents/sacredrest.pdf')
    })

    await test.admin.step(
      'Save button should be disabled and error message should be appear',
      async () => {
        await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled()
        await expect(page.locator('#b9-Modal_UploadDocument')).toContainText(
          'The file is too large to upload, please re-upload.'
        )
        await expect(page.locator('#b9-Modal_UploadDocument')).toContainText(
          'The file is too large to upload.'
        )
        await page.getByRole('button', { name: 'Cancel' }).click()
      }
    )
  }
)
