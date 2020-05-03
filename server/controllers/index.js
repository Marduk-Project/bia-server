const UserModule = require('../models/gl_user');

/**
 * Index for visitors
 */
exports.getIndex = (req, res, next) => {
  res.render('visitor/index', {
    app_loggedIn: false,
    app_flashes: req.flash('messages'),
  });
};

exports.getHome = (req, res, next) => {
  const user = req.user;
  if (!user) {
    res.redirect('/');
    return;
  }
  if (user.levelIsStaff) {
    res.redirect('/admin/');
  } else {
    res.redirect('/account/');
  }
};
