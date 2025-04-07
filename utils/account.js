const { faker } = require('@faker-js/faker')
const { getRandomElement } = require('./helpers')

module.exports = {
  generateNewAdminStaff: () => {
    const person = faker.person
    const fullName = person.fullName().substring(0, 200)

    const countryCode = '65'
    const mobileNumber =
      (faker.datatype.boolean() ? '8' : '9') +
      faker.number.int({ min: 1000000, max: 9999999 }).toString()
    const formattedMobileNumber = { code: countryCode, number: mobileNumber }

    const email = fullName.toLowerCase().replace(/[^a-z0-9]/g, '') + '@mail.com'

    return {
      fullName,
      mobileNumber: formattedMobileNumber,
      email,
    }
  },
  generateNewResident: () => {
    const person = faker.person
    const fullName = person.fullName()
    const splitFullName = fullName.split(' ')
    const preferredName = splitFullName[splitFullName.length - 2]

    const genderList = [
      { label: 'male', value: '0' },
      { label: 'female', value: '1' },
    ]
    const gender = (
      genderList.find((val) => val.label === person.sex()) || genderList[0]
    ).value

    const randomNumber = Math.floor(100 + Math.random() * 900)
    const randomAlphabet = String.fromCharCode(
      65 + Math.floor(Math.random() * 26)
    )
    const NRIC = randomNumber + randomAlphabet

    // DOB
    // Get the current date
    const currDate = new Date()

    // Subtract 50 years from the current date
    currDate.setFullYear(currDate.getFullYear() - 50)

    // Array of month names
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    // Get the month name, day, and year
    const month = months[currDate.getMonth()]
    const day = currDate.getDate() - 1
    const year = currDate.getFullYear()

    // Format the date as "January 1, 1975"
    const dateOfBirth = `${month} ${day}, ${year}`

    const citizenshipList = [
      { label: 'Singapore Citizen', value: '0' },
      { label: 'Singapore Permanent Resident', value: '1' },
    ]
    const citizenship = getRandomElement(citizenshipList).value

    const raceList = [
      { label: 'Chinese', value: '0' },
      { label: 'Malay', value: '1' },
      { label: 'Indian', value: '2' },
      { label: 'Eurasian', value: '3' },
      { label: 'Others', value: '4' },
    ]
    const race = getRandomElement(raceList).value

    const religionList = [
      { label: 'Buddhism', value: '0' },
      { label: 'Catholicism', value: '1' },
      { label: 'Christianity', value: '2' },
      { label: 'Free Thinker', value: '3' },
      { label: 'Hinduism', value: '4' },
      { label: 'Islam', value: '5' },
      { label: 'Sikhism', value: '6' },
      { label: 'Taoism', value: '7' },
      { label: 'Others', value: '8' },
    ]
    const religion = getRandomElement(religionList).value

    const languageList = [
      { label: 'English', value: '0' },
      { label: 'Mandarin', value: '1' },
      { label: 'Malay', value: '2' },
      { label: 'Tamil', value: '3' },
      { label: 'Hindi', value: '4' },
      { label: 'Cantonese', value: '5' },
      { label: 'Hokkien', value: '6' },
      { label: 'Teouchew', value: '7' },
      { label: 'Hakka / Khek', value: '8' },
      { label: 'Others', value: '9' },
    ]
    const language = getRandomElement(languageList).label

    const dateOfRegistration = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const countryCode = '65'
    const mobileNumber =
      (faker.datatype.boolean() ? '8' : '9') +
      faker.number.int({ min: 1000000, max: 9999999 }).toString()
    const formattedMobileNumber = { code: countryCode, number: mobileNumber }

    const homePhoneNumber =
      '6' + faker.number.int({ min: 1000000, max: 9999999 }).toString()
    const formattedHomePhoneNumber = {
      code: countryCode,
      number: homePhoneNumber,
    }

    const mobilityList = [
      { label: 'Ambulatory', value: '0' },
      { label: 'Bedbound', value: '1' },
      { label: 'Wheelchair-bound', value: '2' },
      { label: 'Geriatric', value: '3' },
    ]
    const mobility = getRandomElement(mobilityList).value

    const dementiaList = [
      { label: 'None', value: '0' },
      { label: 'Mild', value: '1' },
      { label: 'Moderate', value: '2' },
      { label: 'Severe', value: '3' },
    ]
    const dementia = getRandomElement(dementiaList).value

    const dietList = [
      { label: 'Regular', value: '0' },
      { label: 'Soft', value: '1' },
      { label: 'Pureed', value: '2' },
      { label: 'Severe', value: '3' },
    ]
    const diet = getRandomElement(dietList).value

    const allergyList = [
      { label: 'Lactose Allergy', value: '0' },
      { label: 'Peanut Allergy', value: '1' },
      { label: 'NSAID Allergy', value: '2' },
    ]
    const allergy = getRandomElement(allergyList).label

    const behaviouralIssueList = [
      { label: 'Aggression', value: '0' },
      { label: 'Paranoia', value: '1' },
      { label: 'Hoarding', value: '2' },
    ]
    const behaviouralIssue = getRandomElement(behaviouralIssueList).label

    const hobbyList = [
      { label: 'Singing', value: '0' },
      { label: 'Calligraphy', value: '1' },
      { label: 'Photography', value: '2' },
    ]
    const hobbies = getRandomElement(hobbyList).label

    const mainNOKFullName = faker.person.fullName()

    const relationList = [
      { label: 'Child', value: '0' },
      { label: 'Parent', value: '1' },
      { label: 'Sibling', value: '2' },
      { label: 'Spouse', value: '3' },
      { label: 'Relative', value: '4' },
      { label: 'Friend', value: '5' },
      { label: 'Others', value: '6' },
    ]
    const relation = getRandomElement(relationList).value

    const NOKMobileNumber =
      (faker.datatype.boolean() ? '8' : '9') +
      faker.number.int({ min: 1000000, max: 9999999 }).toString()
    const formattedNOKMobileNumber = {
      code: countryCode,
      number: NOKMobileNumber,
    }

    return {
      fullName,
      preferredName,
      gender,
      NRIC,
      dateOfBirth,
      citizenship,
      race,
      religion,
      language,
      dateOfRegistration,
      mobileNumber: formattedMobileNumber,
      homePhoneNumber: formattedHomePhoneNumber,
      remarks: 'Remarks for ' + fullName,
      level: '0',
      household: '0',
      bed: '0',
      mobility,
      dementia,
      diet,
      allergy,
      behaviouralIssue,
      hobbies,
      mainNOKFullName,
      relation,
      NOKMobileNumber: formattedNOKMobileNumber,
    }
  },
}
