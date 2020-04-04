const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/admin/maintenance');

// mids
const authMid = require('../../../middlewares/auth-mid');

router.get('/config_get',
  authMid.userIsAdminMiddleware,
  controller.getConfig
);

router.post('/config_update',
  authMid.userIsAdminMiddleware,
  controller.postConfig
);

module.exports = router;
