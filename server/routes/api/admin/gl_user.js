const express = require('express');
const router = express.Router({ mergeParams: true });

const controller = require('../../../controllers/admin/gl_user');
const authMid = require('../../../middlewares/auth-mid');

router.get('/',
  authMid.userIsStaffMiddleware,
  controller.getIndexValidate,
  controller.getIndex
);

router.get('/:id/edit',
  authMid.userIsStaffMiddleware,
  controller.getEditValidate,
  controller.getEdit
);

router.put('/:id',
  authMid.userIsAdminMiddleware,
  controller.putUpdateValidate,
  controller.putUpdate
);

router.post('/',
  authMid.userIsStaffMiddleware,
  controller.postCreateValidate,
  controller.postCreate
);

router.delete('/:id',
  authMid.userIsAdminMiddleware,
  controller.deleteValidate,
  controller.delete
);

// pwd

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

router.post('/:id/pwd_recover',
  authMid.userIsStaffMiddleware,
  controller.postPwdRecoverValidate,
  controller.postPwdRecover
);

module.exports = router;
