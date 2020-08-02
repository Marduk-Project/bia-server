const { NotFoundError, BadRequestError } = require('../middlewares/error-mid');
const GL_UserModule = require('../models/gl_user');
const GL_StateModule = require('../models/gl_state');
const GL_StateModel = GL_StateModule.model;
const GL_CityModule = require('../models/gl_city');
const GL_CityModel = GL_CityModule.model;

const redirectParsers = [
  /**
   * Check for State dashboard redirect, showing images on social media
   */
  async (req, path) => {
    const myRegex = /stateDashboard\/([0-9]{1,10})/;
    const res = myRegex.exec(path);
    if (res) {
      const id = res[1];
      const entity = await GL_StateModel.findByPk(id);
      if (!entity) {
        return false;
      }
      const title = `Dashboard do Estado ${entity.name}`;
      return {
        social: {
          url: req.appRequestFullUrl,
          title: title,
          description: `Esta página exibe da situação atual das solicitações do Estado ${entity.name}`,
        },
        title: title,
        redirect: `/#/or_order/state/${id}/dashboard/`,
      };
    }
    return false;
  },
  async (req, path) => {
    const myRegex = /cityDashboard\/([0-9]{1,10})/;
    const res = myRegex.exec(path);
    if (res) {
      const id = res[1];
      const entity = await GL_CityModel.findByPk(id);
      if (!entity) {
        return false;
      }
      const title = `Dashboard de ${entity.name}`;
      return {
        social: {
          url: req.appRequestFullUrl,
          title: title,
          description: `Esta página exibe da situação atual das solicitações da Cidade de ${entity.name}`,
        },
        title: title,
        redirect: `/#/or_order/state/${entity.stateId}/dashboard/?cityId=${id}`,
      };
    }
    return false;
  },
];

/**
 * Index for visitors
 */
exports.getIndex = (req, res, next) => {
  res.render('visitor/index', {
    app_loggedIn: false,
    app_context: 'visitor',
    app_flashes: req.flash('messages'),
  });
};

exports.getRedirect = async (req, res, next) => {
  try {
    let url = req.originalUrl.replace(/^\/r\//, '');
    url = url.replace(/\/$/, '');
    // search for matchers
    let data = false;
    for (let index = 0; index < redirectParsers.length; index++) {
      const parser = redirectParsers[index];
      data = await parser(req, url);
      if (data) {
        break;
      }
    }
    if (!data) {
      next(new NotFoundError('URL não encontrada.'));
      return;
    }
    data = Object.assign(
      {
        app_loggedIn: false,
      },
      data
    );
    res.render('visitor/redirect', data);
  } catch (err) {
    next(err);
  }
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
