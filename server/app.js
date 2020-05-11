const createError = require('http-errors');
const express = require('express');
const expressValidator = require('express-validator');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const moment = require('moment');
const fs = require('fs');
moment.locale('pt-BR'); // TODO localizar em config
// necessario para mover para o env
const { nconf } = require('../config');

// session
const session = require('express-session');
const flash = require('connect-flash');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const SessionModule = require('./models/sy_session');

const { mainDb } = require('./database/main_connection');

const app = express();

// security
app.disable('x-powered-by');
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// only dev
if (nconf.get('NODE_ENV') == 'development') {
  const logger = require('morgan');
  app.use(logger('dev'));
}

// other
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());

// session (15d)
// TODO pode ser uma configuração
var sessionExpiryDate = new Date(Date.now() + 60 * 60 * 24 * 15 * 1000);
app.use(
  session({
    name: 'APPSESS',
    secret: nconf.get('APP_SESSION_SECRET'),
    resave: false, // TODO pensar nisso
    saveUninitialized: false,
    store: new SequelizeStore({
      db: mainDb,
      modelKey: SessionModule.modelName,
    }),
    cookie: {
      // secure: true,
      httpOnly: true,
      expires: sessionExpiryDate,
      maxAge: 36000000,
    },
  })
);

app.use(flash());

// === app middlewares
// fetch user
app.use(require('./middlewares/auth-mid').fetchUserMiddleware);
// responses
app.use(require('./middlewares/responses-mid').responsesMiddleware);

// routes
const indexRouter = require('./routes');

app.use('/', indexRouter);
app.use('/api', require('./routes/api'));
app.use('/admin', require('./routes/admin'));
app.use('/account', require('./routes/account'));

// only dev
if (nconf.get('NODE_ENV') == 'development') {
  if (fs.existsSync(path.join(__dirname, 'routes', 'zz_dev'))) {
    app.use('/dev', require('./routes/zz_dev'));
  }
}

/* =========================== */

// show 404 not found
app.use(function (req, res, next) {
  res.status(404).render('errors/404_not_found');
});

// error handler
const errorHandler = require('./middlewares/error-mid').handler;
app.use(errorHandler);

// === locals
const vdriver = nconf.get('APP_VERSION_DRIVER');
if (vdriver == 'git') {
  app.locals.app_git_v = require('child_process')
    .execSync('git rev-parse --short HEAD')
    .toString()
    .trim();
} else {
  app.locals.app_git_v = '-v-';
}

app.locals.app_full_name = nconf.get('APP_FULL_NAME');
app.locals.app_short_name = nconf.get('APP_SHORT_NAME');
app.locals.app_website = nconf.get('APP_WEBSITE');

// logo
app.locals.app_logo_base64 =
  'data:image/png;base64,' +
  fs
    .readFileSync(path.join(__dirname, '../front/img/theme/logo-vertical.png'))
    .toString('base64');
app.locals.app_marked = require('marked');

module.exports = app;
