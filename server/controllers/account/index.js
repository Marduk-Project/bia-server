const { body, query, param } = require('express-validator/check');
const {
  validationHandler,
  BadRequestError,
  ApiError,
} = require('../../middlewares/error-mid');

/**
 * Index
 */
exports.getIndex = (req, res, next) => {
  res.render('account/index', {
    app_loggedIn: true,
    app_context: 'account',
    app_flashes: req.flash('messages'),
  });
};
