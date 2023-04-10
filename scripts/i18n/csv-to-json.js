// How to use this script:
// npm run i18n:convert-csv-to-json PATH/TO/CSV PATH/TO/JSON
//
// Please don't forget to set a valid column in `valueColumn` variable below

const csv = require('csvtojson')
const fs = require('fs')

const csvFilePath = process.argv[2]
const destFilePath = process.argv[3]

if (!csvFilePath || !fs.existsSync(csvFilePath)) {
  throw new Error('Please provide a valid source CSV file path.')
}

if (!destFilePath) {
  throw new Error('Please provide a valid destination JSON file path.')
}

const keyColumn = 0
const valueColumn = 3

csv({
  noheader: true,
  output: 'csv',
})
  .fromFile(csvFilePath)
  .then((jsonArray) => {
    const jsonObj = {}

    jsonArray.forEach((row) => {
      const keyParts = row[keyColumn].split('.')
      let currObj = jsonObj

      keyParts.forEach((keyPart, index) => {
        if (index === keyParts.length - 1) {
          currObj[keyPart] = row[valueColumn]
        } else {
          // eslint-disable-next-line
          if (!currObj.hasOwnProperty(keyPart)) {
            currObj[keyPart] = {}
          }
          currObj = currObj[keyPart]
        }
      })
    })

    const jsonString = JSON.stringify(jsonObj, null, 2)

    fs.writeFile(destFilePath, jsonString, (err) => {
      if (err) {
        console.error(err)
        process.exit(1)
      } else {
        console.log('Conversion complete.')
        process.exit(0)
      }
    })
  })
  .catch(() => {
    console.error(`Unable to parse CSV: ${csvFilePath}`)
    process.exit(1)
  })
