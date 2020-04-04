const UserModule = require('../models/user');

/**
 * Index for visitors
 */
exports.getIndex = (req, res, next) => {
  res.render('visitor/index', {
    app_loggedIn: false,
    app_flashes: req.flash('messages'),
  });
}

exports.getHome = (req, res, next) => {
  const user = req.user;
  if (!user) {
    res.redirect('/');
    return;
  }
  if (user.level <= UserModule.LEVEL_MANAGER) {
    res.redirect('/admin/');
  } else {
    res.send('ops tem coisa errada ai');
  }
}

