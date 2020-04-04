const { body, query, param } = require('express-validator/check');
const { validationHandler, BadRequestError, ApiError, ForbiddenError } = require('../middlewares/error-mid');
const UserModule = require('../models/user');
const User = UserModule.model;
const AccountModule = require('../models/account');
const Account = AccountModule.model;
const validator = require('validator');
const RecoverPasswordMail = require('../mails/auth-mail').RecoverPasswordMail;


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
    const user = await User.findOne({ email: email })
      .populate('accounts.account_id');
    if (user) {
      if (user.blocked) {
        res.sendJsonUnauthorizedError('Usuário bloqueado! Entre em contato com a administração.');
        return;
      }
      // found user
      if (user.comparePassword(password)) {
        // password typed ok
        // store on session
        req.session.user_id = user._id;
        req.session.save((error) => {
          if (!error) {
            res.sendJsonOK({
              id: user._id,
              isAdmin: user.isAdmin,
              accounts: user.accounts.map(el => {
                return {
                  _id: el.account_id._id,
                  id: el.account_id._id,
                  name: el.account_id.name,
                  shortname: el.account_id.shortname,
                }
              })
            });
            return;
          }
          res.sendJsonServerError();
        });
      } else {
        res.sendJsonUnauthorizedError('Usuário ou senha inválidos.');
      }
    } else {
      res.sendJsonUnauthorizedError('Usuário ou senha inválidos');
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
    const reset = user.newResetToken();
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
    const id = req.body.id;
    const token = req.body.token;
    const pwd = req.body.password;
    const user = await User.findById(id);
    if (!user) {
      res.sendJsonBadRequestError('Usuário não encontrado.');
      return;
    }
    if (!user.hasResetToken(token)) {
      res.sendJsonBadRequestError('Token não é mais válido.');
      return;
    }
    // clear
    user.resetTokens = [];
    user.setPlainPassword(pwd);
    await user.save();
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
      id: req.user._id,
      _id: req.user._id,
      name: req.user.name,
      nickname: req.user.nickname,
      email: req.user.email,
      level: req.user.level,
    };
  }
  let account = null;
  if (req.account) {
    account = {
      id: req.account._id,
      _id: req.account._id,
      name: req.account.name,
      shortname: req.account.shortname,
      account_level: req.account_level,
      account_level_desc: UserModule.accountLevelToString(req.account_level),
    };
  }
  res.sendJsonOK({
    user: user,
    account: account,
  });
}


/**
 * Select account Validate
 */
exports.postAdminSetAccountValidate = [
  body('id')
    .isMongoId()
    .custom(Account.idExistsFunc()),
  body('level').isIn(UserModule.ACCOUNTLEVEL_ALL),
  async (req, res, next) => {
    try {
      const account = await Account.findById(req.body.id);
      const authResult = await req.user.canAccessAccount(account);
      if (authResult !== true) {
        throw new ForbiddenError(authResult);
      }
      next();
    } catch (err) {
      next(err);
    }
  },
  (req, res, next) => {
    req.getValidationResult()
      .then(validationHandler(next))
      .catch(next);
  },
];

/**
 * Select account in session
 */
exports.postAdminSetAccount = async (req, res, next) => {
  try {
    // set account
    const account = await Account.findById(req.body.id);
    req.session.account_id = account ? account._id : null;
    req.session.account_level = parseInt(req.body.level);
    res.sendJsonOK();
  } catch (err) {
    next(err);
  }
}



/**
 * Select account Validate
 */
exports.postUserSetAccountValidate = [
  body('id')
    .isMongoId()
    .custom(Account.idExistsFunc()),
  async (req, res, next) => {
    try {
      const account = await Account.findById(req.body.id);
      const authResult = await req.user.canAccessAccount(account);
      if (authResult !== true) {
        throw new ForbiddenError(authResult);
      }
      next();
    } catch (err) {
      next(err);
    }
  },
  (req, res, next) => {
    req.getValidationResult()
      .then(validationHandler(next))
      .catch(next);
  },
];

/**
 * Select account in session
 */
exports.postUserSetAccount = async (req, res, next) => {
  try {
    const account = await Account.findById(req.body.id);
    const user = req.user;
    const acItem = user.accounts.find(el => el.account_id.equals(account._id));
    // set account
    req.session.account_id = account ? account._id : null;
    req.session.account_level = parseInt(acItem.level);
    res.sendJsonOK();
  } catch (err) {
    next(err);
  }
}




/**
 * Return current user accounts
 */
exports.getUserAccounts = async (req, res, next) => {
  try {
    const list = await Account.find({ _id: { $in: req.user.accounts.map(el => el.account_id) } });
    res.sendJsonOK({
      data: list.map(el => {
        return {
          _id: el._id,
          id: el.id,
          name: el.name,
          shortname: el.shortname,
        }
      })
    });
  } catch (err) {
    next(err);
  }
}