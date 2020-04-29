const express = require('express')
const router = express.Router()
const controller = require('../../controllers/auth')
const authMid = require('../../middlewares/auth-mid')

router.post('/login', controller.postLogin)

router.post('/logout', controller.getLogoutApi)

router.post('/recoverRequest', controller.postRecoverRequest)

router.post('/recoverChangePwd', controller.postRecoverChangePwd)

router.get('/session', controller.getSessionWeb)

// me

router.get('/me', authMid.userIsLoggedMiddleware, controller.getMe)

router.post(
  '/me/update',
  authMid.userIsLoggedMiddleware,
  controller.postMeUpdateValidate,
  controller.postMeUpdate
)

router.post(
  '/me/pwd_update',
  authMid.userIsLoggedMiddleware,
  controller.postPwdUpdateValidate,
  controller.postPwdUpdate
)

module.exports = router
