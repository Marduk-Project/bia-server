const fs = require('fs');
const { promisify } = require('util');
const nconf = require('nconf');
const path = require('path');
const multer = require('multer');

const { readFileToBase64 } = require('../helpers/file_utils');
const { ApiError } = require('./error-mid');

const uploadPath =
  nconf.get('NODE_ENV') == 'production'
    ? '/tmp/uploads'
    : path.join(__dirname, '../../tmp/uploads');
const multerConfigObj = {
  dest: uploadPath,
  limits: { fileSize: nconf.get('HTTP_FILE_UPLOAD_MAXSIZE') },
};

// img
exports.uploadImageMid = multer({
  ...multerConfigObj,
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype !== 'image/png' ||
      file.mimetype !== 'image/gif' ||
      file.mimetype !== 'image/jpeg' ||
      file.mimetype !== 'image/jpg'
    ) {
      return cb(null, false);
    } else {
      cb(null, true);
    }
  },
});
// json
exports.uploadJsonMid = multer({
  ...multerConfigObj,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'application/json') {
      return cb(null, false);
    } else {
      cb(null, true);
    }
  },
});
// file required
exports.uploadFileCheckRequiredMid = async (req, res, next) => {
  if (!req.file) {
    next(new ApiError('File field is required.'));
  }
  next();
};

/**
 * Appends the uploadRemoveFunction utility
 */
exports.uploadUtilsMid = (req, res, next) => {
  // funcs
  const removeAsync = promisify(fs.unlink);

  /**
   * Remove uploads
   */
  req.uploadsRemove = async function () {
    if (this.file) {
      await removeAsync(this.file.path);
    }
    if (this.files) {
      await Promise.all(
        this.files.map(async file => {
          await removeAsync(file.path);
        })
      );
    }
  };

  /**
   * Move the file
   * @param {String} destination
   */
  req.uploadMoveFromFile = function (destination) {
    return new Promise((resolve, reject) => {
      if (!this.file) {
        reject(new Error('File not found!'));
      }
      fs.rename(this.file.path, destination, err => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  };

  /**
   * Move the file
   * @param {Object} file
   * @param {String} destination
   * @returns {Promise}
   */
  req.uploadMoveFile = function (file, destination) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('File not found!'));
        return;
      }
      fs.rename(file.path, destination, err => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  };

  /**
   * Base64 from file
   * @param {Object} file
   * @param {String} destination
   * @returns {Promise}
   */
  req.uploadReadBase64File = function (file) {
    return readFileToBase64(file.path);
  };
  // follow
  next();
};
