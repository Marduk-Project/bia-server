const _ = require('lodash');
const nconf = require('nconf');

const errorMid = require('./error-mid');
const UnauthenticatedError = errorMid.UnauthenticatedError;
const ForbiddenError = errorMid.ForbiddenError;
const BadRequestError = errorMid.BadRequestError;
const ApiError = errorMid.ApiError;
const ServerError = errorMid.ServerError;

/**
 * Sends Error message
 * @param {string|undefined} message
 * @param {number|undefined} status
 */
const sendJsonError = function (message, status) {
  message = message || 'Usuário não autorizado a realizar esta operação.';
  this.status(status || 403).json({
    ok: false,
    message: message,
    error: message,
  });
};

/**
 * Sends Forbidden message
 * @param {string|undefined} message
 */
const sendJsonForbiddenError = function (message) {
  message = message || 'Usuário não autorizado a realizar esta operação.';
  throw new ForbiddenError(message);
};

/**
 * Sends Forbidden message
 * @param {string} message
 */
const sendJsonUnauthorizedError = function (message) {
  message = message || 'Usuário não está logado.';
  throw new UnauthenticatedError(message);
};

/**
 * Sends Forbidden message
 * @param {string} message
 */
const sendJsonServerError = function (message) {
  message = message || 'Erro no servidor.';
  throw new ServerError(message);
};

/**
 * Sends Forbidden message
 * @param {string} message
 */
const sendJsonBadRequestError = function (message) {
  message = message || 'Requisição inválida.';
  throw new BadRequestError(message);
};

/**
 * Sends Forbidden message
 * @param {string} message
 */
const sendJsonApiError = function (message) {
  message = message || 'Erro de aplicação / API.';
  throw new ApiError(message);
};

/**
 * Sends ok with message
 * @param {string} data
 * @param {string} warning
 */
const sendJsonOK = function (data) {
  let response = {
    ok: true,
  };
  if (data) {
    _.merge(response, data);
  }
  this.json(response);
};

/**
 * Sends ok with message
 * @param {string} data
 * @param {string} warning
 */
const sendJsonCreatedOK = function (data) {
  let response = {
    ok: true,
  };
  if (data) {
    _.merge(response, data);
  }
  this.status(201).json(response);
};

/**
 * Generate app url
 */
const appUrl = function (path) {
  return `${nconf.get('APP_URL')}${path}`;
};

/**
 * Applyes helpers functions
 */
exports.responsesMiddleware = (req, res, next) => {
  // === req
  req.appRequestFullUrl =
    req.protocol + '://' + req.get('host') + req.originalUrl;
  // === res
  // errors
  res.sendJsonForbiddenError = sendJsonForbiddenError;
  res.sendJsonUnauthorizedError = sendJsonUnauthorizedError;
  res.sendJsonServerError = sendJsonServerError;
  res.sendJsonError = sendJsonError;
  res.sendJsonBadRequestError = sendJsonBadRequestError;
  res.sendJsonApiError = sendJsonApiError;
  // ok
  res.sendJsonOK = sendJsonOK;
  res.sendJsonCreatedOK = sendJsonCreatedOK;
  // others
  res.appUrl = appUrl;
  // locals
  res.locals.app_ip = req.connection.remoteAddress;
  next();
};
