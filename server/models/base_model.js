const validator = require('validator');
const PAGINATION_PER_PAGE = 100;
const { mainDb } = require('../database/main_connection');
const { Sequelize, Model } = require('sequelize');

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

class BaseModel extends Model { }

exports.BaseModel = BaseModel;