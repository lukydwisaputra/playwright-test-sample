# Sprint 3
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

### Admin 
`admin.spec.js` 
1. US-1: Update Senior Portfolio - Admin
2. US-4: Delete Senior Photos from Portfolio Album
3. US-13: Portfolio Approval
4. US-14: Portfolio Approval - Edit New Portfolio
5. US-21: Admin View Senior Profile - Portfolio
6. US-22: Admin View My Entries
7. US-23: Admin View Portfolio Timeline

### Staff 
`staff.spec.js` 
1. US-2: Update Senior Portfolio for Approval - Staff
2. US-16: Staff View Portfolio Page
3. US-17: Staff View Portfolio Details
4. US-18: Staff View Portfolio - Timeline
5. US-19: Staff View Portfolio - Album

### NOK 
`nok.spec.js` 
1. US-5: NOK View Senior List
2. US-6: NOK View Senior Portfolio Details - Timeline
3. US-7: NOK View Senior Portfolio Details - Album

## Related Documents

1. [Acceptance & Rejection Criteria][criteria]
2. [SIT Task List][sit-task]
3. [Sprint 3 Whiteboard][wb]



[criteria]: 
<https://app.clickup.com/14276360/v/dc/dknr8-37036/dknr8-26796>
[sit-task]: 
<https://app.clickup.com/14276360/v/l/6-901605392687-1>
[wb]: 
<https://app.clickup.com/14276360/v/wb/dknr8-45376>


