const UserModule = require('../models/gl_user');
// const AccountUserModule = require('../models/account/user');
const User = UserModule.model;

/**
 * Creates a function middleware with roles
 * @param {object} config
 * @param {boolean} [config.userLogged=undefined]
 * @param {number} [config.userLevel=undefined]
 * @param {boolean} config.responseRedirect
 * @returns {function}
 */
exports.rolesMiddleware = config => {
  const middleware = (req, res, next) => {
    const user = req.user;
    if (typeof config === 'object') {
      // user logged
      if (typeof config.userLogged === 'boolean') {
        if (config.userLogged) {
          if (!user) {
            // not logged
            if (config.responseRedirect || req.method == 'GET') {
              req.flash('messages', {
                message: 'Usuário não está logado.',
                type: 'info',
              });
              res.redirect('/#/auth/login');
            } else {
              res.sendJsonForbiddenError();
            }
            return;
          }
        } else {
          if (user) {
            // logged
            if (config.responseRedirect) {
              res.redirect('/home');
            } else {
              res.sendJsonForbiddenError('Usuário já está logado.');
            }
            return;
          }
        } // if user logged
      } // if user logged boolean
      // user level
      if (typeof config.userLevel === 'number') {
        if (!user) {
          // has user
          res
            .status(403)
            .json({ ok: false, message: 'Usuário não autorizado.' });
          return;
        }
        if (parseInt(user.level) > config.userLevel) {
          // user level
          res
            .status(403)
            .json({ ok: false, message: 'Usuário não autorizado.' });
          return;
        }
      }
    } // if config object
    // ok
    next();
  };
  return middleware;
};

/**
 * User is logged middleware
 */
exports.userIsLoggedMiddleware = exports.rolesMiddleware({
  userLogged: true,
});

/**
 * User is admin middleware
 */
exports.userIsAdminMiddleware = exports.rolesMiddleware({
  userLevel: UserModule.LEVEL_ADMIN,
  userLogged: true,
});

/**
 * User is manager staff
 */
exports.userIsStaffMiddleware = exports.rolesMiddleware({
  userLevel: UserModule.LEVEL_STAFF,
  userLogged: true,
});

/**
 * User is account middleware
 */
exports.userIsAccountMiddleware = exports.rolesMiddleware({
  userLevel: UserModule.LEVEL_ACCOUNT,
  userLogged: true,
});

/**
 * Stores user on the middleware
 */
exports.fetchUserMiddleware = async (req, res, next) => {
  if (req.session.user_id) {
    req.user = await User.findByPk(req.session.user_id);
    req.userContext = 'visitor';
    if (req.user.levelIsAdmin || req.user.levelIsStaff) {
      req.userContext = 'admin';
    } else if (req.user.levelIsAccount) {
      req.userContext = 'account';
    }
  } else {
    req.user = null;
    req.userContext = 'visitor';
  }
  next();
};
