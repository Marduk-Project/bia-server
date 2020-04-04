const controller = require('../../../controllers/admin/user');

const express = require('express');
const router = express.Router({ mergeParams: true });

// mids
const authMid = require('../../../middlewares/auth-mid');

router.get('/',
  authMid.userIsAdminMiddleware,
  controller.getIndexValidate,
  controller.getIndex
);

router.get('/:id/edit',
  authMid.userIsAdminMiddleware,
  controller.getEditValidate,
  controller.getEdit
);

router.put('/:id',
  authMid.userIsAdminMiddleware,
  controller.putUpdateValidate,
  controller.putUpdate
);

router.post('/',
  authMid.userIsAdminMiddleware,
  controller.postCreateValidate,
  controller.postCreate
);

router.delete('/:id',
  authMid.userIsAdminMiddleware,
  controller.deleteValidate,
  controller.delete
);

// customs

router.post('/:id/pwd_check',
  authMid.userIsAdminMiddleware,
  controller.postPwdCheckValidate,
  controller.postPwdCheck
);

router.post('/:id/pwd_change',
  authMid.userIsAdminMiddleware,
  controller.postPwdChangeValidate,
  controller.postPwdChange
);

router.get('/me',
  authMid.userIsLoggedMiddleware,
  controller.getMe
);

router.post('/me/update',
  authMid.userIsLoggedMiddleware,
  controller.postMeUpdateValidate,
  controller.postMeUpdate
);

router.post('/me/pwd_update',
  authMid.userIsLoggedMiddleware,
  controller.postPwdUpdateValidate,
  controller.postPwdUpdate
);

module.exports = router;
