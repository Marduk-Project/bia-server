const fs = require('fs')
const { uniqBy } = require('lodash')

const onlyProducts = require('./products-list.json')
const consolidatedProducts = require('./products-list-from-consolidated.json')

const mergedList = uniqBy([...onlyProducts, ...consolidatedProducts], 'name')

fs.writeFileSync(
  './products-lists-merged.json',
  JSON.stringify(mergedList, null, 2)
)
