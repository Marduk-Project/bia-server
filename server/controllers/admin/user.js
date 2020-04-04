const { body, query, param } = require('express-validator/check');
const { validationHandler, BadRequestError, ApiError } = require('../../middlewares/error-mid');
const UserModule = require('../../models/user');
// const AccountUserModule = require('../../models/account/user');
const AccountModule = require('../../models/account');
const User = UserModule.model;
const Account = AccountModule.model;
const validator = require('validator');
const utils = require('../../helpers/utils');

/**
 * List Validation
 */
exports.getIndexValidate = [
  query('page').optional().isInt(),
  query('q').optional().isString(),
  query('level').optional().isInt(),
  (req, res, next) => {
    req.getValidationResult()
      .then(validationHandler(next))
      .catch(next);
  },
];

/**
 * List Index
 */
exports.getIndex = async (req, res, next) => {
  try {
    const where = {};
    // q
    if (req.query.q) {
      const q = req.query.q;
      where.$or = [
        {
          name: {
            $regex: q,
            $options: 'i',
          },
        },
        {
          nickname: {
            $regex: q,
            $options: 'i',
          }
        },
        {
          email: {
            $regex: q,
            $options: 'i',
          }
        },
      ];
      if (validator.isMongoId(q)) {
        where.$or.push({ _id: q });
      }
    }
    // level
    if (req.query.level) {
      where.level = req.query.level;
    }
    const page = req.query.page || 1;
    const meta = await User.paginateMeta(page, where);
    const data = await User
      .paginate(page, where)
      .populate('accounts.account_id')
      .sort({
        name: 1,
      });
    res.sendJsonOK({
      data: data,
      meta: meta,
    });
  } catch (err) {
    next(err);
  }
}




/**
 * Get for Edit Validate
 */
exports.getEditValidate = [
  param('id')
    .isMongoId()
    .not().isEmpty()
    .custom(User.idExistsFunc()),
  (req, res, next) => {
    req.getValidationResult()
      .then(validationHandler(next))
      .catch(next);
  },
];

/**
 * Get for Edit
 */
exports.getEdit = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('accounts.account_id')
    res.sendJsonOK({
      data: user
    });
  } catch (err) {
    next(err);
  }
}




/**
 * Save validation
 */
const saveValidate = [
  param('id')
    .optional()
    .isMongoId(),
  body('name')
    .isString()
    .trim(),
  body('nickname')
    .isString()
    .trim(),
  body('level')
    .isIn(UserModule.LEVEL_ALL),
  body('email')
    .isEmail(),
  body('blocked')
    .isBoolean(),
  body('accounts')
    .isArray(),
  body('accounts.*.account_id')
    .isMongoId()
    .custom(Account.idExistsFunc()),
  body('accounts.*.level')
    .isIn(UserModule.ACCOUNTLEVEL_ALL),
  body('accounts.*._id')
    .optional()
    .isMongoId(),
  body('accounts.*.mid')
    .isNumeric(),
];

const saveEntityFunc = async (req, res, next, id) => {
  try {
    const body = req.body;
    let entity = null;
    let accountBeforeList;
    if (id) {
      entity = await User
        .findById(id)
        .populate('accounts.account_id');
      accountBeforeList = entity.accounts;
    } else {
      entity = new User();
      accountBeforeList = [];
    }
    entity.name = body.name;
    entity.nickname = body.nickname;
    entity.email = body.email;
    entity.level = body.level;
    entity.blocked = body.blocked;
    entity.accounts = body.accounts.map(el => {
      return {
        _id: el._id,
        mid: el.mid,
        account_id: el.account_id,
        level: el.level,
      }
    });
    if (id) {
      // visit each account and inactive
      await Promise.all(accountBeforeList.map(async (ac) => {
        const found = entity.accounts.find((el) => {
          return ac.account_id._id.equals(el.account_id);
        });
        // if not found before, set inactive
        if (!found) {
          const AccountUser = await AccountUserModule.modelFactory(ac.account_id);
          const acUser = await AccountUser.findById(entity._id);
          if (acUser) {
            acUser.inactive = true;
            await acUser.save();
          }
        }
      }));
    } else {
      // generate random only if is create
      entity.password = utils.randomString(16);
    }
    // save the user
    await entity.save();
    // visit each new and create
    await Promise.all(entity.accounts.map(async (ac) => {
      const found = accountBeforeList.find((el) => {
        return ac.account_id._id.equals(el.account_id);
      });
      // if not found, add
      if (!found) {
        const account = await Account.findById(ac.account_id);
        // TODO remover
        /*
        const AccountUser = await AccountUserModule.modelFactory(account);
        let acUser = await AccountUser.findById(entity._id);
        if (!acUser) {
          acUser = new AccountUser({
            _id: entity._id,
            name: entity.name,
            nickname: entity.nickname,
            email: entity.email,
            inactive: false,
          });
          await acUser.save();
        }
        */
      }
    }));
    let result = {
      data: entity
    };
    // send result
    if (id) {
      res.sendJsonOK(result);
    } else {
      res.sendJsonCreatedOK(result);
    }
  } catch (err) {
    next(err);
  }
}

/** Update validation */
exports.putUpdateValidate = [
  ...saveValidate,
  param('id')
    .isMongoId()
    .custom(User.idExistsFunc()),
  (req, res, next) => {
    req.getValidationResult()
      .then(validationHandler(next))
      .catch(next);
  },
];

/**
 * Update
 */
exports.putUpdate = async (req, res, next) => {
  try {
    await saveEntityFunc(req, res, next, req.params.id);
  } catch (err) {
    next(err);
  }
}




/**
 * Create validation
 */
exports.postCreateValidate = [
  ...saveValidate,
  (req, res, next) => {
    req.getValidationResult()
      .then(validationHandler(next))
      .catch(next);
  },
];

/**
 * Create
 */
exports.postCreate = async (req, res, next) => {
  try {
    await saveEntityFunc(req, res, next);
  } catch (err) {
    next(err);
  }
}




/**
 * Delete Validate
 */
exports.deleteValidate = [
  param('id').isMongoId(),
  (req, res, next) => {
    req.getValidationResult()
      .then(validationHandler(next))
      .catch(next);
  },
];

/**
* Delete
*/
exports.delete = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (id == req.user._id.toString()) {
      throw new ApiError("Você não pode excluir a si mesmo.");
    }
    const entity = await User.findById(id);
    if (entity) {
      await entity.remove();
    }
    res.sendJsonOK({
      data: entity,
    });
  } catch (err) {
    next(err);
  }
}




/**
 * Returns the current user
 */
exports.getMe = (req, res, next) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    nickname: req.user.nickname,
    email: req.user.email,
    level: req.user.level,
  }
  res.json({
    data: user,
  });
}




/**
 * Validation
 */
exports.postMeUpdateValidate = [
  body('name')
    .isString()
    .not()
    .isEmpty()
    .trim(),
  body('nickname')
    .isString()
    .not()
    .isEmpty()
    .trim(),
  (req, res, next) => {
    req.getValidationResult()
      .then(validationHandler(next))
      .catch(next);
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
}




exports.postPwdUpdateValidate = [
  body('pwd_current')
    .isString()
    .trim(),
  body('pwd_new')
    .isString()
    .isLength({ min: 6, max: 32 })
    .trim(),
  (req, res, next) => {
    req.getValidationResult()
      .then(validationHandler(next))
      .catch(next);
  },
];

exports.postPwdUpdate = async (req, res, next) => {
  try {
    const { pwd_current, pwd_new } = req.body;
    const user = req.user;
    if (!user.comparePassword(pwd_current)) {
      throw new BadRequestError('Senha atual não confere.');
    }
    user.setPlainPassword(pwd_new);
    await user.save();
    res.sendJsonOK();
  } catch (err) {
    next(err);
  }
}




/** 
 * Test password Validate 
*/
exports.postPwdCheckValidate = [
  body('pwd')
    .isString()
    .trim(),
  param('id')
    .isMongoId()
    .not().isEmpty()
    .custom(User.idExistsFunc()),
  (req, res, next) => {
    req.getValidationResult()
      .then(validationHandler(next))
      .catch(next);
  },
];

/** Test password */
exports.postPwdCheck = async (req, res, next) => {
  try {
    const id = req.params.id;
    const pwd = req.body.pwd;
    const user = await User.findById(id);
    if (!user.comparePassword(pwd)) {
      throw new ApiError('Senha errada!');
    }
    res.sendJsonOK();
  } catch (err) {
    next(err);
  }
};





/** Change password Validate */
exports.postPwdChangeValidate = [
  body('pwd')
    .isString()
    .trim(),
  param('id')
    .isMongoId()
    .not().isEmpty()
    .custom(User.idExistsFunc()),
  (req, res, next) => {
    req.getValidationResult()
      .then(validationHandler(next))
      .catch(next);
  },
];

/** Change password */
exports.postPwdChange = async (req, res, next) => {
  try {
    const id = req.params.id;
    const pwd = req.body.pwd;
    if (id == req.user._id.toString()) {
      throw new ApiError("Você não pode alterar sua própria senha desta forma.");
    }
    const entity = await User.findById(id)
    entity.setPlainPassword(pwd);
    await entity.save();
    res.sendJsonOK();
  } catch (err) {
    next(err);
  }
};
