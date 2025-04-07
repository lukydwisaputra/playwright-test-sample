module.exports = {
  sortAsc: (arr) => {
    return arr.sort((a, b) => a.localeCompare(b))
  },
  sordDesc: (arr) => {
    return arr.sort((a, b) => b.localeCompare(a))
  },
  isSorted: (arr1, arr2) => {
    // Check if the arrays have the same length
    if (arr1.length !== arr2.length) {
      return false
    }

    // Compare each element of the arrays
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false
      }
    }

    // If all elements are the same, return true
    return true
  },
  getRandomElement: (array) => {
    // Generate a random index
    const randomIndex = Math.floor(Math.random() * array.length)
    // Return the element at the random index
    return array[randomIndex]
  },
}
