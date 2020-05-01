const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const indexController = require('../controllers/index');
const UserModule = require('../models/gl_user');

// const rolesMiddleware = require('../middlewares/auth-mid').rolesMiddleware({
//   userLevel: UserModule.LEVEL_ADMIN,
//   userLogged: true,
//   responseRedirect: true,
// });

// index
router.get('/', indexController.getIndex);
router.get('/home', indexController.getHome);

// auth
router.get('/logout', authController.getLogoutWeb);
router.get('/auth/recover/:token', authController.getRecoverRedirect);

module.exports = router;
