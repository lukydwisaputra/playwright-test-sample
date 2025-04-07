const { test, expect } = require('@playwright/test')
const { wait } = require('../utils/time')

test('US-1: Example', async ({ page }, testInfo) => {
  // screenshot test
  await testInfo.attach()
})

// test('US-1: Pagination', async ({ page }) => {

// })

// test('US-1: Sorting', async ({ page }) => {

// })

// test('US-1: Filtering', async ({ page }) => {

// })

// test('US-1: View Details Action', async ({ page }) => {

// })