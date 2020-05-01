const fs = require('fs');
const xlsxFile = require('read-excel-file/node');

const schema = {
  UF: {
    prop: 'stateCode',
    type: String,
  },
  'Mesorregião Geográfica': {
    prop: 'mesoRegionCode',
    type: String,
  },
  Nome_Mesorregião: {
    prop: 'mesoRegionName',
    type: String,
  },
  'Microrregião Geográfica': {
    prop: 'microRegionCode',
    type: String,
  },
  Nome_Microrregião: {
    prop: 'microRegionName',
    type: String,
  },
  Município: {
    prop: 'cityCode',
    type: String,
  },
  'Código Município Completo': {
    prop: 'cityCodeComplete',
    type: String,
  },
  Nome_Município: {
    prop: 'cityName',
    type: String,
  },
};

console.log(
  'Attempting to extract data from: ./RELATORIO_DTB_BRASIL_MUNICIPIO.xlsx'
);
const excelData = xlsxFile('./RELATORIO_DTB_BRASIL_MUNICIPIO.xlsx', {
  schema,
})
  .then(({ rows, errors }) => ({
    regions: getRegions(rows),
    cities: rows,
  }))
  .then(writeToJSONFile);

const mockData = [
  {
    stateCode: 12,
    mesoRegionCode: 2,
    mesoRegionName: 'Vale do Acre',
    microRegionCode: 3,
    microRegionName: 'Sena Madureira',
    cityCode: 435,
    cityName: 'Santa Rosa do Purus',
  },
  {
    stateCode: 12,
    mesoRegionCode: 2,
    mesoRegionName: 'Vale do Acre',
    microRegionCode: 3,
    microRegionName: 'Sena Madureira',
    cityCode: 500,
    cityName: 'Sena Madureira',
  },
];
// console.log(JSON.stringify(getRegions(mockData), null, 2));

function getRegions(rows) {
  console.log('Grouping regions data...');
  return rows.reduce(
    (list, region) => {
      if (!list.meso.codes.includes(region.mesoRegionCode)) {
        list.meso.codes.push(region.mesoRegionCode);
        list.meso.maps.push({
          code: region.mesoRegionCode,
          name: region.mesoRegionName,
        });
      }
      if (!list.micro.codes.includes(region.microRegionCode)) {
        list.micro.codes.push(region.microRegionCode);
        list.micro.maps.push({
          code: region.microRegionCode,
          name: region.microRegionName,
        });
      }
      return list;
    },
    { micro: { codes: [], maps: [] }, meso: { codes: [], maps: [] } }
  );
}

function writeToJSONFile(data) {
  console.log('Saving extracted date to: ./cities-micro-meso-regions.json');
  return fs.writeFileSync(
    './cities-micro-meso-regions.json',
    JSON.stringify(data, null, 2)
  );
}
