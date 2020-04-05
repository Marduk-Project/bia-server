const { body, query, param } = require('express-validator/check');
const { validationHandler, BadRequestError, ApiError, ForbiddenError } = require('../middlewares/error-mid');
const UserModule = require('../models/gl_user');
const User = UserModule.model;
const UserRecoverModule = require('../models/gl_user_recover');
const UserRecover = UserRecoverModule.model;
const validator = require('validator');
const RecoverPasswordMail = require('../mails/auth-mail').RecoverPasswordMail;
const moment = require('moment');
const { Op } = require('sequelize');

/**
 * realizes login 
 */
exports.postLogin = async (req, res, next) => {
  try {
    const email = req.body.username;
    const password = req.body.password;
    if (!validator.isEmail(email) || (typeof password !== 'string')) {
      res.sendJsonError();
      return;
    }
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      if (user.blocked) {
        res.sendJsonUnauthorizedError('Usuário bloqueado! Entre em contato com a administração.');
        return;
      }
      // found user
      // check to many tries
      if (user.loginTryWait) {
        if (moment(user.loginTryWait).isAfter(new Date())) {
          res.sendJsonUnauthorizedError('Muitas tentaivas. Aguarde alguns minutos e tente novamente.');
          return;
        }
      }
      // compare pwd
      if (user.password_compare(password)) {
        // password typed ok
        user.loginTryCount = 0;
        user.loginTryWait = null;
        await user.save();
        // store on session
        req.session.user_id = user.id;
        req.session.save((error) => {
          if (!error) {
            res.sendJsonOK({
              id: user.id,
              isStaff: user.levelIsStaff,
            });
            return;
          }
          res.sendJsonServerError();
        });
      } else {
        user.loginTryCount += 1;
        // TODO criar uma configuracao
        if (user.loginTryCount > 5) {
          user.loginTryWait = moment().add(1, 'm').toDate();
        }
        await user.save();
        res.sendJsonUnauthorizedError('Usuário ou senha inválidos.');
      }
    } else {
      res.sendJsonUnauthorizedError('Usuário ou senha inválidos.');
    } // if user
  } catch (err) {
    next(err);
  }
}

/**
 * Realizes logout
 */
exports.getLogoutApi = (req, res, next) => {
  req.session.destroy(() => {
    res.json({ ok: true })
  });
}

/**
 * Logout with redirect
 */
exports.getLogoutWeb = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/#/auth/logout')
  });
}

/**
 * Sends mail for password forgot
 */
exports.postRecoverRequest = async (req, res, next) => {
  try {
    const email = req.body.username;
    if (!validator.isEmail(email)) {
      res.sendJsonBadRequestError();
      return;
    }
    let tmpUser;
    const user = await User.findOne({ email: email })
    if (!user) {
      res.sendJsonOK();
      return;
    }
    tmpUser = user;
    const reset = await user.recover_newToken();
    const mail = new RecoverPasswordMail(user, reset);
    await mail.send(req, res, next);
    await tmpUser.save();
    res.sendJsonOK();
  } catch (err) {
    next(err);
  }
}

exports.getRecoverRedirect = (req, res, next) => {
  if (!req.params.token) {
    res.sendJsonBadRequestError();
    return;
  }
  res.redirect(`/#/auth/recover/${req.params.token}`);
}

exports.postRecoverChangePwd = async (req, res, next) => {
  try {
    const userId = req.body.id;
    const token = req.body.token;
    const pwd = req.body.password;
    const entity = await UserRecover.findOne({
      where: {
        userId: userId,
        token: token,
        expiresWhen: {
          [Op.gte]: new Date(),
        }
      }
    });
    if (!entity) {
      res.sendJsonBadRequestError('Token não é mais válido.');
      return;
    }
    // clear
    let user = await User.findByPk(userId);
    user.password_setPlain(pwd);
    await user.save();
    await entity.destroy();
    res.sendJsonOK();
  } catch (err) {
    next(err);
  }
}



/**
 * Returns if user is authenticated
 */
exports.getSessionWeb = (req, res, next) => {
  let user = null;
  if (req.user) {
    user = {
      id: req.user.id,
      name: req.user.name,
      nickname: req.user.nickname,
      email: req.user.email,
      level: req.user.level,
    };
  }
  res.sendJsonOK({
    user: user,
  });
}
