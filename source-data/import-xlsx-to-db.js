// 1. read excel
// 2. creates breadown as
//   [
//     {
//       key: 'cityName',
//       model: 'gl_city',
//       modelField: 'name',
//       list: ['porto alegre', 'novo hamburgo'],
//     },
//   ];
// 3. fetches id from the breakdown to each value.
// 4. when saving we can refer to the id of each value from `fetchedIds['gl_city']['porto alegre']`
// 5. set normalized object to save in db
// 6. save in db

require('../config.js');
const { checkIsConnected } = require('../server/database/main_connection.js');

const { breakdownToMatch, excelData } = require('./read-consolidated');
const { matchItems, idByModel } = require('./match-item-to-id');

const failureRows = [];

checkIsConnected()
  .then(() => matchItems(breakdownToMatch))
  .then(normalizeDataForDB)
  .then(saveDataToDB)
  .then(handleBrokenData);

function normalizeDataForDB() {
  return excelData.map(normalizeRowDataForDB).filter(x => x !== null);
}
function normalizeRowDataForDB(row) {
  const { productName, unitName, personName, quantity, notes } = row;
  const glProductId = idByModel['gl_product'][productName];
  const glUnitId = idByModel['gl_unit'][unitName];
  const glPersonRequestingId = idByModel['gl_person'][personName];

  if (glProductId && glUnitId && glPersonRequestingId) {
    return {
      or_request: {
        // glUserId ?
        glPersonRequestingId,
      },
      or_request_item: {
        glProductId,
        glUnitId,
        quantity,
        notes,
        // requestId ?
      },
    };
  } else {
    failureRows.push({
      dataFromExcel: row,
      retrievedIds: {
        glProductId,
        glUnitId,
        glPersonRequestingId,
      },
    });
    return null;
  }
}

function saveDataToDB(data) {
  console.error('\n');
  console.log('DATA TO BE SAVED');
  console.log('---');
  console.log(JSON.stringify(data, null, 2));
}

function handleBrokenData() {
  const numFailures = failureRows.length;
  if (numFailures) {
    console.error('\n\n');
    console.error(`${numFailures} FAILURES FOUND`);
    console.log('---');
    console.error('there rows failed:', failureRows);

    // should we
    // - save some log file?
  }
}
