const winston = require('../helpers/winston');
const nconf = require('nconf');
const logger = winston.logger;

/**
 * Base application error class
 */
class AppBaseError extends Error {
  /**
   * Application base error
   * @param {string} message 
   * @param {number} [status=400]
   * @param {strig} [logLevel='warn']
   */
  constructor(message, status, logLevel) {
    super(message);
    this.name = this.constructor.name;
    this.status = status || 400;
    this.logLevel = logLevel || 'warn';
    // Capturing stack trace, excluding constructor call from it.
    // Error.captureStackTrace(this, this.constructor);
  }

  toJson() {
    return errorToJson(this);
  }
}

/**
 * User not logged in
 */
class UnauthenticatedError extends AppBaseError {
  constructor(message) {
    super(message, 401);
  }
}

class ForbiddenError extends AppBaseError {
  constructor(message) {
    super(message, 403);
  }
}

class BadRequestError extends AppBaseError {
  constructor(message) {
    super(message, 400);
  }
}

class NotFoundError extends AppBaseError {
  constructor(message) {
    super(message, 404);
  }
}

class ApiError extends AppBaseError {
  constructor(message) {
    super(message, 403);
  }
}

class ServerError extends AppBaseError {
  constructor(message) {
    super(message, 500);
  }
}

/** 
 * Convertes error to json 
 * @param {Error} err
 * @returns {Object}
*/
const errorToJson = (err) => {
  const json = {
    ok: false,
    message: err.message
  }
  if (nconf.get('NODE_ENV') != 'production') {
    json.stack = err.stack;
    json.error = err.toString();
  }
  return json;
}

/**
 * Application error handler
 */
exports.handler = (err, req, res, next) => {
  if (res.headersSent) {
    if (next) {
      return next(err);
    }
    return;
  }
  let toJson = false;
  let saveLog = true;
  if (
    (err instanceof ForbiddenError) ||
    (err instanceof UnauthenticatedError) ||
    (err instanceof BadRequestError) ||
    (err instanceof ServerError) ||
    (err instanceof NotFoundError) ||
    (err instanceof ApiError)
  ) {
    toJson = true;
  }
  // save the log
  if (saveLog) {
    logger.error(err.stack || err.toString());
  }
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  if (toJson) {
    res.json(err.toJson());
  } else {
    if (req.method == 'GET') {
      res.render('errors/error');
    } else {
      res.json(errorToJson(err));
    }
  }
}

/**
 * Validation error
 */
exports.validationHandler = next => result => {
  if (result.isEmpty()) {
    if (next) {
      next();
    }
    return;
  }
  if (!next) {
    throw new BadRequestError(
      result.array().map(i => `'${i.param}' has ${i.msg}`).join('\n')
    );
  } else {
    let str = result.array()
      .map(i => {
        return `<li><b>${i.param}</b>: ${i.msg}</li>`;
      })
      .join('\n');
    str = `Ocorreram os seguintes erros na requisição:<br/><ul style="margin: 0px;">${str}</ul>`;
    return next(new BadRequestError(str));
  }
}

// exports classes errors
exports.UnauthenticatedError = UnauthenticatedError;
exports.ForbiddenError = ForbiddenError;
exports.BadRequestError = BadRequestError;
exports.ApiError = ApiError;
exports.ServerError = ServerError;
exports.NotFoundError = NotFoundError;
