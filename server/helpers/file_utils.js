const fs = require('fs');

/**
 * Delete folder recursive
 * @param {String} path 
 */
const deleteFolderRecursiveSync = function (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursiveSync(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

/**
 * Reads file to base64
 * @param {String} path
 * @returns {Promise}
 */
const readFileToBase64 = (path) => {
  return new Promise((resolve, reject) => {
    if (!path) {
      reject(new Error('File not found!'));
      return;
    }
    fs.readFile(path, {}, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString('base64'));
      }
    });
  });
}

module.exports = {
  deleteFolderRecursiveSync: deleteFolderRecursiveSync,
  readFileToBase64: readFileToBase64,
}
