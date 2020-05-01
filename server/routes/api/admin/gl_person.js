const express = require('express');
const router = express.Router({ mergeParams: true });

const controller = require('../../../controllers/admin/gl_person');
const authMid = require('../../../middlewares/auth-mid');

router.get(
  '/',
  authMid.userIsStaffMiddleware,
  controller.getIndexValidate,
  controller.getIndex
);

router.get(
  '/:id/edit',
  authMid.userIsStaffMiddleware,
  controller.getEditValidate,
  controller.getEdit
);

router.put(
  '/:id',
  authMid.userIsStaffMiddleware,
  controller.putUpdateValidate,
  controller.putUpdate
);

router.post(
  '/',
  authMid.userIsStaffMiddleware,
  controller.postCreateValidate,
  controller.postCreate
);

router.delete(
  '/:id',
  authMid.userIsAdminMiddleware,
  controller.deleteValidate,
  controller.delete
);

module.exports = router;
