const { test, expect } = require('../Core/Core')
import { generateNewResident } from '../../utils/account'
import { faker } from '@faker-js/faker'
import { wait } from '../../utils/time'

const resident = generateNewResident()
console.log(resident)

test.admin(
  'US2 [Admin to Resident] | Open Registration Form',
  async ({ page }, testInfo) => {
    await test.admin.step('Go to Resident List', async () => {
      await page.goto('https://outtst.werkdone.com/NOKGateway_UI/Users')
    })

    await test.admin.step('Click Add Resident Button', async () => {
      await page.getByRole('button', { name: 'Add Resident' }).click()
    })

    await test.admin.step(
      'Should be redirected to Resident Registration Page',
      async () => {
        await page.getByRole('button', { name: 'Add Resident' }).click()
        await expect(page).toHaveTitle('ResidentRegistration')
      }
    )
  }
)

test.admin(
  'US2 [Admin to Resident] | Fill Out and Submit Form ',
  async ({ page }, testInfo) => {
    await test.admin.step('Go to Resident List', async () => {
      await page.goto('https://outtst.werkdone.com/NOKGateway_UI/Users')
    })

    await test.admin.step('Click Add Resident Button', async () => {
      await page.getByRole('button', { name: 'Add Resident' }).click()
    })

    await test.admin.step(
      'Should be redirected to Resident Registration Page',
      async () => {
        await page.getByRole('button', { name: 'Add Resident' }).click()
      }
    )

    await test.admin.step('Upload Profile Picture', async () => {
      // await page.locator('#b9-PhotoProfile_Upload').click()
      await page
        .locator('#b9-PhotoProfile_Upload')
        .setInputFiles('images/ProfilePicture.png')
    })

    await test.admin.step('Fill Personal Information Form', async () => {
      test.admin.setTimeout(60_000)
      await page.getByPlaceholder('Name of resident as in NRIC').click()
      await page
        .getByPlaceholder('Name of resident as in NRIC')
        .fill(resident.fullName)

      await page.getByLabel('Preferred Name').click()
      await page.getByLabel('Preferred Name').fill(resident.preferredName)

      await page.getByLabel('Gender').selectOption(resident.gender)

      await page.getByPlaceholder('e.g. 123A').click()
      await page.getByPlaceholder('e.g. 123A').fill(resident.NRIC)

      await page.locator('#b9-DatePicker_Dob').getByRole('textbox').click()
      // await page.getByRole('spinbutton', { name: 'Year' }).click();
      // await page.getByRole('spinbutton', { name: 'Year' }).fill('1974');
      await wait(2_000)
      await page.getByLabel(resident.dateOfBirth).click()

      await page.getByLabel('Citizenship').selectOption(resident.citizenship)

      await page.getByLabel('Race').selectOption(resident.race)

      await page.getByLabel('Religion').selectOption(resident.religion)

      await page.getByText('Select language').click()
      await page
        .getByRole('option', { name: resident.language })
        .locator('span')
        .first()
        .click()

      await page.getByRole('textbox', { name: 'DD-MM-YYYY' }).click()
      await page.getByLabel(resident.dateOfRegistration).click()

      await page.getByLabel('Mobile Number').click()
      await page.getByLabel('Mobile Number').fill(resident.mobileNumber.number)

      await page.getByLabel('Home Phone Number').click()
      await page
        .getByLabel('Home Phone Number')
        .fill(resident.homePhoneNumber.number)

      await page.getByPlaceholder('Notes').click()
      await page.getByPlaceholder('Notes').fill(resident.remarks)
    })

    await test.admin.step('Fill Location Form', async () => {
      await page.getByLabel('Level').selectOption(resident.level)
      await page.getByLabel('Household').selectOption(resident.household)
      await page.getByLabel('Bed').selectOption(resident.bed)

      await page
        .locator('#FooterContent')
        .getByRole('button', { name: 'Next' })
        .click()
    })

    await test.admin.step('Fill Additional Information Form', async () => {
      await page.getByLabel('Mobility').selectOption(resident.mobility)
      await page.getByLabel('Dementia').selectOption(resident.dementia)
      await page.getByLabel('Diet').selectOption(resident.diet)
      await page.getByPlaceholder('E.g. lactose allergy, peanut').click()
      await page
        .getByPlaceholder('E.g. lactose allergy, peanut')
        .fill(resident.allergy)
      await page.getByPlaceholder('E.g. aggression, paranoia,').click()
      await page
        .getByPlaceholder('E.g. aggression, paranoia,')
        .fill(resident.behaviouralIssue)
      await page.getByPlaceholder('E.g. singing, calligraphy,').click()
      await page
        .getByPlaceholder('E.g. singing, calligraphy,')
        .fill(resident.hobbies)
      await page
        .locator('#FooterContent')
        .getByRole('button', { name: 'Next' })
        .click()
    })

    // faker.datatype.boolean(0.5)
    //   ? await test.admin.step('Select NOK from exiating list', async () => {
    //       await page.getByText('Search existing NOK').click()
    //       await wait(1_000)
    //       await page
    //         .getByText('NOK 01')
    //         .click()
    //     })
    //   :
    await test.admin.step('Register new main NOK', async () => {
      await page.getByPlaceholder('Name of NOK as in NRIC').click()
      await page
        .getByPlaceholder('Name of NOK as in NRIC')
        .fill(resident.mainNOKFullName)
      await page
        .getByLabel('Relation to Residen')
        .selectOption(resident.relation)
      await page.getByPlaceholder('e.g. 8123').click()
      await page
        .getByPlaceholder('e.g. 8123')
        .fill(resident.NOKMobileNumber.number)
    })

    await test.admin.step('Submit resident registration form', async () => {
      await page
        .locator('#FooterContent')
        .getByRole('button', { name: 'Submit' })
        .click()
      await page.getByRole('button', { name: 'Submit' }).click()
    })

    await test.admin.step(
      'New Resident should be listed on Resident List',
      async () => {
        await page.getByPlaceholder('Search by Name').click()
        await page.getByPlaceholder('Search by Name').fill(resident.fullName)
        await expect(page.locator('tbody')).toContainText(resident.fullName)
        await expect(page.locator('tbody')).toContainText('Active')
      }
    )
  }
)

test.admin(
  'US2 [Admin to Resident] | Form Validation - Required Fields',
  async ({ page }, testInfo) => {
    await test.admin.step('Go to Resident List', async () => {
      await page.goto('https://outtst.werkdone.com/NOKGateway_UI/Users')
    })

    await test.admin.step('Click Add Resident Button', async () => {
      await page.getByRole('button', { name: 'Add Resident' }).click()
    })

    await test.admin.step(
      'Should be redirected to Resident Registration Page',
      async () => {
        await page.getByRole('button', { name: 'Add Resident' }).click()
      }
    )

    await test.admin.step(
      'Expect error label should be visible for mandatory input [personal information]',
      async () => {
        await page
          .locator('#FooterContent')
          .getByRole('button', { name: 'Next' })
          .click()
        await expect(
          page.locator('#b9-Input_FullName_DescribedBy')
        ).toContainText('This field is required.')
        await expect(
          page.locator('#b9-Dropdown_Gender_DescribedBy')
        ).toContainText('This field is required.')
        await expect(
          page.locator('#b9-Input_Last3DigitNRIC_DescribedBy')
        ).toContainText('This field is required.')
        await expect(page.locator('#b9-Input_DoB_DescribedBy')).toContainText(
          'This field is required.'
        )
        await expect(
          page.locator('#b9-Dropdown_Citizenship_DescribedBy')
        ).toContainText('This field is required.')
        await expect(
          page.locator('#b9-Dropdown_Religion_DescribedBy')
        ).toContainText('This field is required.')
        await expect(page.locator('#b9-LanguageWrapper')).toContainText(
          'This field is required'
        )
        await expect(
          page.locator('#b9-Input_DateOfRegistration_DescribedBy')
        ).toContainText('This field is required.')
        await expect(
          page.locator('#b9-Input_MobileNumber_DescribedBy')
        ).toContainText('This field is required.')
        await expect(
          page.locator('#b9-Input_HomePhoneNumber_DescribedBy')
        ).toContainText('This field is required.')
        await expect(
          page.locator('#b9-Dropdown_Level_DescribedBy')
        ).toContainText('This field is required.')
        await expect(
          page.locator('#b9-Dropdown_Household_DescribedBy')
        ).toContainText('This field is required.')
      }
    )

    await test.admin.step('Fill Personal Information Form', async () => {
      test.admin.setTimeout(60_000)
      await page.getByPlaceholder('Name of resident as in NRIC').click()
      await page
        .getByPlaceholder('Name of resident as in NRIC')
        .fill(resident.fullName)

      await page.getByLabel('Preferred Name').click()
      await page.getByLabel('Preferred Name').fill(resident.preferredName)

      await page.getByLabel('Gender').selectOption(resident.gender)

      await page.getByPlaceholder('e.g. 123A').click()
      await page.getByPlaceholder('e.g. 123A').fill(resident.NRIC)

      await page.locator('#b9-DatePicker_Dob').getByRole('textbox').click()
      // await page.getByRole('spinbutton', { name: 'Year' }).click();
      // await page.getByRole('spinbutton', { name: 'Year' }).fill('1974');
      // await wait(2_000)
      await page.getByLabel(resident.dateOfBirth).click()

      await page.getByLabel('Citizenship').selectOption(resident.citizenship)

      await page.getByLabel('Race').selectOption(resident.race)

      await page.getByLabel('Religion').selectOption(resident.religion)

      await page.getByText('Select language').click()
      await page
        .getByRole('option', { name: resident.language })
        .locator('span')
        .first()
        .click()

      await page.getByRole('textbox', { name: 'DD-MM-YYYY' }).click()
      await page.getByLabel(resident.dateOfRegistration).click()

      await page.getByLabel('Mobile Number').click()
      await page.getByLabel('Mobile Number').fill(resident.mobileNumber.number)

      await page.getByLabel('Home Phone Number').click()
      await page
        .getByLabel('Home Phone Number')
        .fill(resident.homePhoneNumber.number)

      await page.getByPlaceholder('Notes').click()
      await page.getByPlaceholder('Notes').fill(resident.remarks)
    })

    await test.admin.step('Fill Location Form', async () => {
      await page.getByLabel('Level').selectOption(resident.level)
      await page.getByLabel('Household').selectOption(resident.household)
      await page.getByLabel('Bed').selectOption(resident.bed)

      await page
        .locator('#FooterContent')
        .getByRole('button', { name: 'Next' })
        .click()
    })

    await test.admin.step(
      'Expect error label should be visible for mandatory input [additional information]',
      async () => {
        await page
          .locator('#FooterContent')
          .getByRole('button', { name: 'Next' })
          .click()
        await expect(
          page.locator('#b10-Dropdown_Mobility_DescribedBy')
        ).toContainText('This field is required.')
        await expect(
          page.locator('#b10-Dropdown_Dementia_DescribedBy')
        ).toContainText('This field is required.')
      }
    )

    await test.admin.step('Fill Additional Information Form', async () => {
      await page.getByLabel('Mobility').selectOption(resident.mobility)
      await page.getByLabel('Dementia').selectOption(resident.dementia)
      await page.getByLabel('Diet').selectOption(resident.diet)
      await page.getByPlaceholder('E.g. lactose allergy, peanut').click()
      await page
        .getByPlaceholder('E.g. lactose allergy, peanut')
        .fill(resident.allergy)
      await page.getByPlaceholder('E.g. aggression, paranoia,').click()
      await page
        .getByPlaceholder('E.g. aggression, paranoia,')
        .fill(resident.behaviouralIssue)
      await page.getByPlaceholder('E.g. singing, calligraphy,').click()
      await page
        .getByPlaceholder('E.g. singing, calligraphy,')
        .fill(resident.hobbies)
      await page
        .locator('#FooterContent')
        .getByRole('button', { name: 'Next' })
        .click()
    })

    await test.admin.step(
      'Expect error label should be visible for mandatory input [NOK information]',
      async () => {
        await page
          .locator('#FooterContent')
          .getByRole('button', { name: 'Submit' })
          .click()
        await expect(
          page.locator('#b11-Input_MainNOKName_DescribedBy')
        ).toContainText('This field is required.')
        await expect(
          page.locator('#b11-Dropdown_MainNOKRelation_DescribedBy')
        ).toContainText('This field is required.')
        await expect(
          page.locator('#b11-Input_MainNOKMobileNumber_DescribedBy')
        ).toContainText('This field is required.')
      }
    )
  }
)

test.default(
  'US2 [Admin to Resident] | Role Authorization',
  async ({ page }, testInfo) => {
    await test.default.step('Go to Resident List', async () => {
      await page.goto(
        'https://outtst.werkdone.com/NOKGateway_UI/ResidentRegistration'
      )
    })

    await test.default.step('Should be redirected to Login Page', async () => {
      await expect(page).toHaveTitle('Login')
    })
  }
)

test.admin(
  'US2 [Admin to Resident] | Duplicate Registration ',
  async ({ page }, testInfo) => {
    await test.admin.step('Go to Resident List', async () => {
      await page.goto('https://outtst.werkdone.com/NOKGateway_UI/Users')
    })

    await test.admin.step('Click Add Resident Button', async () => {
      await page.getByRole('button', { name: 'Add Resident' }).click()
    })

    await test.admin.step(
      'Should be redirected to Resident Registration Page',
      async () => {
        await page.getByRole('button', { name: 'Add Resident' }).click()
      }
    )

    await test.admin.step('Upload Profile Picture', async () => {
      // await page.locator('#b9-PhotoProfile_Upload').click()
      await page
        .locator('#b9-PhotoProfile_Upload')
        .setInputFiles('images/ProfilePicture.png')
    })

    await test.admin.step('Fill Personal Information Form', async () => {
      test.admin.setTimeout(60_000)
      await page.getByPlaceholder('Name of resident as in NRIC').click()
      await page
        .getByPlaceholder('Name of resident as in NRIC')
        .fill(resident.fullName)

      await page.getByLabel('Preferred Name').click()
      await page.getByLabel('Preferred Name').fill(resident.preferredName)

      await page.getByLabel('Gender').selectOption(resident.gender)

      await page.getByPlaceholder('e.g. 123A').click()
      await page.getByPlaceholder('e.g. 123A').fill(resident.NRIC)

      await page.locator('#b9-DatePicker_Dob').getByRole('textbox').click()
      // await page.getByRole('spinbutton', { name: 'Year' }).click();
      // await page.getByRole('spinbutton', { name: 'Year' }).fill('1974');
      // await wait(2_000)
      await page.getByLabel(resident.dateOfBirth).click()

      await page.getByLabel('Citizenship').selectOption(resident.citizenship)

      await page.getByLabel('Race').selectOption(resident.race)

      await page.getByLabel('Religion').selectOption(resident.religion)

      await page.getByText('Select language').click()
      await page
        .getByRole('option', { name: resident.language })
        .locator('span')
        .first()
        .click()

      await page.getByRole('textbox', { name: 'DD-MM-YYYY' }).click()
      await page.getByLabel(resident.dateOfRegistration).click()

      await page.getByLabel('Mobile Number').click()
      await page.getByLabel('Mobile Number').fill(resident.mobileNumber.number)

      await page.getByLabel('Home Phone Number').click()
      await page
        .getByLabel('Home Phone Number')
        .fill(resident.homePhoneNumber.number)

      await page.getByPlaceholder('Notes').click()
      await page.getByPlaceholder('Notes').fill(resident.remarks)
    })

    await test.admin.step('Fill Location Form', async () => {
      await page.getByLabel('Level').selectOption(resident.level)
      await page.getByLabel('Household').selectOption(resident.household)
      await page.getByLabel('Bed').selectOption(resident.bed)

      await page
        .locator('#FooterContent')
        .getByRole('button', { name: 'Next' })
        .click()
    })

    await test.admin.step('Fill Additional Information Form', async () => {
      await page.getByLabel('Mobility').selectOption(resident.mobility)
      await page.getByLabel('Dementia').selectOption(resident.dementia)
      await page.getByLabel('Diet').selectOption(resident.diet)
      await page.getByPlaceholder('E.g. lactose allergy, peanut').click()
      await page
        .getByPlaceholder('E.g. lactose allergy, peanut')
        .fill(resident.allergy)
      await page.getByPlaceholder('E.g. aggression, paranoia,').click()
      await page
        .getByPlaceholder('E.g. aggression, paranoia,')
        .fill(resident.behaviouralIssue)
      await page.getByPlaceholder('E.g. singing, calligraphy,').click()
      await page
        .getByPlaceholder('E.g. singing, calligraphy,')
        .fill(resident.hobbies)
      await page
        .locator('#FooterContent')
        .getByRole('button', { name: 'Next' })
        .click()
    })

    faker.datatype.boolean(0.5)
      ? await test.admin.step('Select NOK from existing list', async () => {
          await page.getByText('Search existing NOK').click()
          await wait(1_000)
          await page.getByText('NOK 01').click()
        })
      : await test.admin.step('Register new main NOK', async () => {
          await page.getByPlaceholder('Name of NOK as in NRIC').click()
          await page
            .getByPlaceholder('Name of NOK as in NRIC')
            .fill(resident.mainNOKFullName)
          await page
            .getByLabel('Relation to Residen')
            .selectOption(resident.relation)
          await page.getByPlaceholder('e.g. 8123').click()
          await page
            .getByPlaceholder('e.g. 8123')
            .fill(resident.NOKMobileNumber.number)
        })

    await test.admin.step('Submit resident registration form', async () => {
      await page
        .locator('#FooterContent')
        .getByRole('button', { name: 'Submit' })
        .click()
      await page.getByRole('button', { name: 'Submit' }).click()
    })

    // await test.admin.step(
    //   'New Resident should be listed on Resident List',
    //   async () => {
    //     await page.getByPlaceholder('Search by Name').click()
    //     await page.getByPlaceholder('Search by Name').fill(resident.fullName)
    //     await expect(page.locator('tbody')).toContainText(resident.fullName)
    //     await expect(page.locator('tbody')).toContainText('Active')
    //   }
    // )
  }
)
