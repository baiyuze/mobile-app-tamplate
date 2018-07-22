const fs = require('fs');
const path = require('path');
const fromJSONFile = require('./file.read.js');
const forEach = require('lodash/forEach');
let fileApi = {};

let fileAdr = fs.readdirSync(path.resolve('./mock/apimap/'));

fileAdr.forEach((fileName, index) => {
  let obj = require(path.resolve(`./mock/apimap/${fileName}`));
  forEach(obj,(value, key) => {
    fileApi[key] = fromJSONFile(value);
  })
});


module.exports = fileApi;
