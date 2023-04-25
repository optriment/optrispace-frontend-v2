// How to use this script:
// npm run i18n:compare-locales PATH/TO/FILE1 PATH/TO/FILE2

const fs = require('fs')

const filePath1 = process.argv[2]
const filePath2 = process.argv[3]

if (!filePath1 || !fs.existsSync(filePath1)) {
  throw new Error('Please provide a valid filePath1 path.')
}

if (!filePath2 || !fs.existsSync(filePath2)) {
  throw new Error('Please provide a valid filePath2 path.')
}

console.log(`Comparing ${filePath1} with ${filePath2}`)

const file1 = fs.readFileSync(filePath1)
const file2 = fs.readFileSync(filePath2)

const data1 = JSON.parse(file1)
const data2 = JSON.parse(file2)

const errors = []

// Function to compare objects recursively
function compareObjects(obj1, obj2, path = '') {
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  keys1.forEach((key) => {
    const newPath = path ? `${path}.${key}` : key

    if (!keys2.includes(key)) {
      errors.push(`${filePath2}: key "${newPath}" is missing`)
    } else if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
      compareObjects(obj1[key], obj2[key], newPath)
    } else if (obj1[key].trim().length === 0) {
      errors.push(`${filePath1}: key "${newPath}" has an empty value`)
    } else if (obj1[key].match(/^\s|\s$/)) {
      errors.push(
        `${filePath1}: key "${newPath}" has extra whitespaces: "${obj1[key]}"`
      )
    } else if (obj1[key].match(/\s{2,}/)) {
      errors.push(
        `${filePath1}: key "${newPath}" has multiple whitespaces: "${obj1[key]}"`
      )
    } else if (obj2[key].trim().length === 0) {
      errors.push(`${filePath2}: key "${newPath}" has an empty value`)
    } else if (obj2[key].match(/^\s|\s$/)) {
      errors.push(
        `${filePath2}: key "${newPath}" has extra whitespaces: "${obj2[key]}"`
      )
    } else if (obj2[key].match(/\s{2,}/)) {
      errors.push(
        `${filePath2}: key "${newPath}" has multiple whitespaces: "${obj2[key]}"`
      )
    }
  })

  keys2.forEach((key) => {
    const newPath = path ? `${path}.${key}` : key

    if (!keys1.includes(key)) {
      errors.push(`${filePath1}: key "${newPath}" is missing`)
    }
  })
}

// Compare the objects
compareObjects(data1, data2)

if (errors.length > 0) {
  console.error('There are errors:')
  console.error(errors)
  process.exit(1)
} else {
  console.log('Files comparison complete.')
  process.exit(0)
}
