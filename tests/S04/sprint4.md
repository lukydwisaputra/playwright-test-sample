# Sprint 4
# System Integration Testing

Description of Playwright Test Script Organized by User Roles

- Purpose of the Test Script
The primary goal of this Playwright test script is to validate the functionalities 
and user experiences of an application across different user roles: 
Admin, Staff, and Next of Kin (NOK). By organizing the tests based on user roles, 
we ensure that each type of user can perform their specific flows accurately and 
that the application behaves as expected for each role.

- Structure of the Tests
The test script will be structured into three main sections, 
each corresponding to a user role. Each section will contain a series of test 
scenarios that cover the specific flows and functionalities associated with that role:

  1. Admin 
  2. Staff 
  3. Next of Kin (NOK)

## Events
### Admin 
`events/admin.spec.js`
1. US-12: View Events
2. US-13: Create New Event
3. US-14: Add Event Target Attendees
4. US-15: Invite NOKs to Join Event
5. US-20: Add Participants to Event Form
6. US-21: Event Consent Time Limit
7. US-23: Add Participants to Created Event

### Staff
`events/staff.spec.js` 
1. US-16: View Upcoming Events List
2. US-19: View My Events

### NOK
`events/nok.spec.js`
1. US-16: View Upcoming  Events List
2. US-19: View My Events


## Communications
### Admin 
`communications/admin.spec.js`
1. US-6: Create Broadcast Message to multiple NOKs
2. US-13: View Broadcast List

### Staff 
`communications/staff.spec.js` 


### NOK 
`communications/nok.spec.js`
1. US-8: Switch Senior Inbox
2. US-11: View Inbox List
3. US-12: Respond to acknowledgement request


## Related Documents
1. [Acceptance & Rejection Criteria][criteria]
2. [SIT Task List][sit-task]
3. [Sprint 4 Whiteboard][wb]



[criteria]: 
<https://app.clickup.com/14276360/v/dc/dknr8-37036/dknr8-34096>
[sit-task]: 
<https://app.clickup.com/14276360/v/l/6-901605392687-1>
[wb]: 
<https://app.clickup.com/14276360/v/wb/dknr8-45376>


