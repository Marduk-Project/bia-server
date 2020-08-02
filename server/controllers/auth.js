const { body, query, param } = require('express-validator/check');
const validator = require('validator');
const moment = require('moment');
const nconf = require('nconf');
const { Op } = require('sequelize');

const {
  validationHandler,
  BadRequestError,
  ApiError,
  ForbiddenError,
} = require('../middlewares/error-mid');
const { recaptchaCheck } = require('../helpers/validator');

const UserModule = require('../models/gl_user');
const User = UserModule.model;
const UserRecoverModule = require('../models/gl_user_recover');
const UserRecover = UserRecoverModule.model;
const { RecoverPasswordMail } = require('../mails/auth-mail');
const PersonContactModelModule = require('../models/gl_person_contact');
const PersonContactModel = PersonContactModelModule.model;

/**
 * realizes login
 */
exports.postLogin = async (req, res, next) => {
  try {
    const email = req.body.username;
    const password = req.body.password;
    // security
    if (!validator.isEmail(email) || typeof password !== 'string') {
      res.sendJsonError();
      return;
    }

    // recaptcha
    if (nconf.get('GOOGLE_RECAPTCHA_ENABLED', false)) {
      if (!(await recaptchaCheck(req.body.recaptchaToken))) {
        res.sendJsonServerError(
          'Erro ao validar recaptcha. Por favor tente novamente!'
        );
        return;
      }
    }

    // user
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      if (user.blocked) {
        res.sendJsonUnauthorizedError(
          'Usuário bloqueado! Entre em contato com a administração.'
        );
        return;
      }
      // found user
      // check to many tries
      if (user.loginTryWait) {
        if (moment(user.loginTryWait).isAfter(new Date())) {
          res.sendJsonUnauthorizedError(
            'Muitas tentaivas. Aguarde alguns minutos e tente novamente.'
          );
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
        req.session.save(error => {
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
};

/**
 * Realizes logout
 */
exports.getLogoutApi = (req, res, next) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
};

/**
 * Logout with redirect
 */
exports.getLogoutWeb = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/#/auth/logout');
  });
};

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
    const user = await User.findOne({ email: email });
    if (!user) {
      // no error message to avoid hacking
      res.sendJsonOK();
      return;
    }
    await user.recover_generateAndSend(false, req, res);
    res.sendJsonOK();
  } catch (err) {
    next(err);
  }
};

exports.getRecoverRedirect = (req, res, next) => {
  if (!req.params.token) {
    res.sendJsonBadRequestError();
    return;
  }
  res.redirect(`/#/auth/recover/${req.params.token}`);
};

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
        },
      },
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
};

/**
 * Returns if user is authenticated
 */
exports.getSessionWeb = async (req, res, next) => {
  try {
    let user = null;
    let personContactList = [];
    if (req.user) {
      user = {
        id: req.user.id,
        name: req.user.name,
        nickname: req.user.nickname,
        email: req.user.email,
        level: req.user.level,
      };
      personContactList = await PersonContactModel.findAll({
        where: {
          userId: req.user.id,
        },
        include: [
          {
            association: 'person',
            include: ['city'],
          },
        ],
        order: [['id', 'asc']],
      });
      personContactList = await PersonContactModelModule.jsonSerializer(
        personContactList,
        'account'
      );
    }
    res.sendJsonOK({
      user: user,
      personContactList: personContactList,
    });
  } catch (err) {
    next(err);
  }
};

// ==== user chabges

/**
 * Returns the current user
 */
exports.getMe = (req, res, next) => {
  const user = {
    _id: req.user.id,
    name: req.user.name,
    nickname: req.user.nickname,
    email: req.user.email,
    level: req.user.level,
  };
  res.json({
    data: user,
  });
};

/**
 * Validation
 */
exports.postMeUpdateValidate = [
  body('name').isString().not().isEmpty().trim(),
  body('nickname').isString().not().isEmpty().trim(),
  (req, res, next) => {
    req.getValidationResult().then(validationHandler(next)).catch(next);
  },
];

/**
 * Update current user data
 */
exports.postMeUpdate = async (req, res, next) => {
  try {
    const user = req.user;
    user.name = req.body.name;
    user.nickname = req.body.nickname;
    await user.save();
    res.sendJsonOK();
  } catch (err) {
    next(err);
  }
};

exports.postPwdUpdateValidate = [
  body('pwd_current').isString().trim(),
  body('pwd_new').isString().isLength({ min: 6, max: 32 }).trim(),
  (req, res, next) => {
    req.getValidationResult().then(validationHandler(next)).catch(next);
  },
];

exports.postPwdUpdate = async (req, res, next) => {
  try {
    const { pwd_current, pwd_new } = req.body;
    const user = req.user;
    if (!user.password_compare(pwd_current)) {
      throw new BadRequestError('Senha atual não confere.');
    }
    user.password_setPlain(pwd_new);
    await user.save();
    res.sendJsonOK();
  } catch (err) {
    next(err);
  }
};
