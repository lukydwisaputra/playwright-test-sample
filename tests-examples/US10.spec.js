test.admin('US10 - Admin | Sorting', async ({ page }, testInfo) => {
  await test.admin.step('Go to admin list', async () => {
    await page.goto('https://outtst.werkdone.com/NOKGateway_UI/AdminPortal')
  })

  let sortColumn
  await test.admin.step('Parse column inner text', async () => {
    // Select the table element
    await expect(page.locator('table.table')).toBeVisible()

    const column = await page.locator(`table.table thead tr th`).count()
    const row = await page.locator(`table.table tbody tr`).count()

    let allTask = []
    const getColumn = async () => {
      let columnTask = []
      for (let i = 0; i < column; i++) {
        columnTask.push(
          page.locator('table.table thead tr th').nth(i).innerText()
        )
      }
      return await Promise.all(columnTask)
    }

    const getRow = async (columnIndex) => {
      let rowTask = []
      for (let i = 0; i < row; i++) {
        let tr = page.locator('table.table tbody tr').nth(i)
        rowTask.push(tr.locator('td').nth(columnIndex).innerText())
      }
      return await Promise.all(rowTask)
    }

    allTask.push(getColumn(), getRow(0), getRow(1), getRow(2))
    const [columnList, adminList, roleList, statusList] = await Promise.all(
      allTask
    )

    sortColumn = { columnList, adminList, roleList, statusList }
  })

  await test.admin.step('Check admin name sorting', async () => {
    await page.locator('th').filter({ hasText: 'Admin' }).click()

    console.log(sortColumn.adminList)
    console.log(sortAsc(sortColumn.adminList))
    console.log(await page.locator('tbody tr td').first().innerText())
    console.log(sortAsc(sortColumn.adminList)[0])

    // await expect(page.locator('tbody tr td').first().innerText()).toContainText(
    //   sortAsc(sortColumn.adminList)[0]
    // )
    // await expect(page.locator('tbody tr td').last().innerText()).toContainText(
    //   sortAsc(sortColumn.adminList)[sortColumn.adminList.length]
    // )
  })
})