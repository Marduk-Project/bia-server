const fs = require('fs')
const { promisify } = require('util')
const { readFileToBase64 } = require('../helpers/file_utils')
const nconf = require('nconf')
const path = require('path')
const multer = require('multer')
const uploadPath = path.join(__dirname, '../../uploads/')
const multerConfigObj = {
  dest: uploadPath,
  limits: { fileSize: nconf.get('HTTP_FILE_UPLOAD_MAXSIZE') },
}
// default
const uploadMid = multer(multerConfigObj)
// img
const uploadImageMid = multer({
  ...multerConfigObj,
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype !== 'image/png' ||
      file.mimetype !== 'image/gif' ||
      file.mimetype !== 'image/jpeg' ||
      file.mimetype !== 'image/jpg'
    ) {
      return cb(null, false)
    } else {
      cb(null, true)
    }
  },
})

/**
 * Appends the uploadRemoveFunction utility
 */
exports.utilsMiddleware = (req, res, next) => {
  // funcs
  const removeAsync = promisify(fs.unlink)

  /**
   * Remove uploads
   */
  req.uploadsRemove = async function () {
    if (this.file) {
      await removeAsync(this.file.path)
    }
    if (this.files) {
      await Promise.all(
        this.files.map(async file => {
          await removeAsync(file.path)
        })
      )
    }
  }

  /**
   * Move the file
   * @param {String} destination
   */
  req.uploadMoveFromFile = function (destination) {
    return new Promise((resolve, reject) => {
      if (!this.file) {
        reject(new Error('File not found!'))
      }
      fs.rename(this.file.path, destination, err => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  }

  /**
   * Move the file
   * @param {Object} file
   * @param {String} destination
   * @returns {Promise}
   */
  req.uploadMoveFile = function (file, destination) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('File not found!'))
        return
      }
      fs.rename(file.path, destination, err => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  }

  /**
   * Base64 from file
   * @param {Object} file
   * @param {String} destination
   * @returns {Promise}
   */
  req.uploadReadBase64File = function (file) {
    return readFileToBase64(file.path)
  }
  // follow
  next()
}

/**
 * multer preconfigured middleware
 */
exports.uploadMiddleware = uploadMid

/**
 * multer image middleware
 */
exports.uploadImageMiddleware = uploadImageMid

/**
 * default upload file path
 */
exports.uploadPath = uploadPath

/**
 * multer default configure object
 */
exports.multerConfigObj = multerConfigObj
