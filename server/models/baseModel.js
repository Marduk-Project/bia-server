const validator = require('validator');
const PAGINATION_PER_PAGE = 100;
const ApiError = require('../middlewares/error-mid').ApiError;
const { mainDb } = require('../database/mainConnection');
const { Sequelize } = require('sequelize');

const sanitizePage = (page) => {
  if (typeof page != 'number') {
    try {
      page = parseInt(page || 1);
    } catch (err) {
      page = 1;
    }
  }
  return Math.max(page, 1);
}

// TODO pagination / pagination meta
// id exists
// id exists func

exports.PAGINATION_PER_PAGE = PAGINATION_PER_PAGE;

class BaseModel extends Sequelize.Model { }

exports.BaseModel = BaseModel;