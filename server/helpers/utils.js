const _ = require("lodash");
const fs = require("fs");

/**
 * Generates random alphanumeric string
 * @param {Number} length
 */
const randomString = (length) => {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 * from https://gist.github.com/Yimiprod/7ee176597fef230d1451
 */
function diffObject(object, base) {
  function changes(object, base) {
    return _.transform(object, function (result, value, key) {
      if (!_.isEqual(value, base[key])) {
        if (value === null || value === undefined) {
          result[key] = value;
        } else if (
          value.constructor &&
          value.constructor.name == "ObjectId" &&
          base[key].constructor &&
          base[key].constructor.name == "ObjectId"
        ) {
          // object id equals
          if (!value.equals(base[key])) {
            result[key] = value;
          }
        } else if (_.isDate(value)) {
          result[key] = value;
        } else if (
          value &&
          value.constructor &&
          value.constructor.name == "Object" &&
          base[key] &&
          base[key].constructor &&
          base[key].constructor.name == "Object"
        ) {
          result[key] = changes(value, base[key]);
        } else {
          result[key] = value;
        }
      }
    });
  }
  return changes(object, base);
}

module.exports = {
  randomString,
  diffObject,
};
