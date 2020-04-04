const baseModelPlugin = require('./baseModel');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nconf = require('nconf');
const { mainDb } = require('../database/mainConnection');
const { Sequelize, DataTypes, Model } = require('sequelize');

// level
const LEVEL_ADMIN = 1;
const LEVEL_STAFF = 5;
const LEVEL_ACCOUNT = 10;

exports.LEVEL_ADMIN = LEVEL_ADMIN;
exports.LEVEL_STAFF = LEVEL_STAFF;
exports.LEVEL_ACCOUNT = LEVEL_ACCOUNT;
exports.LEVEL_ALL = [
  LEVEL_ADMIN,
  LEVEL_STAFF,
  LEVEL_ACCOUNT,
];

const levelToString = (value) => {
  switch (parseInt(value)) {
    case LEVEL_ADMIN:
      return 'Administrador';

    case LEVEL_STAFF:
      return 'Gestão';

    case LEVEL_ACCOUNT:
      return 'Conta';
  }
  return 'Desconhecido';
}
exports.levelToString = levelToString;


/**
 * Applies a custom template string to the password
 * @param {String} pwd 
 */
const applyCustomSaltToPassword = (pwd) => {
  let template = nconf.get('PWD_SALT_TEMPLATE');
  if (!template) {
    template = "salt{pwd}salt";
  }
  return template.replace('{pwd}', pwd);
}



// model

class User extends Model {
  login_cleanTry() {
    this.login_tryCount = 0;
    this.login_tryWait = null;
  }

  password_compare(pwd) {
    pwd = applyCustomSaltToPassword(pwd);
    // check
    return bcrypt.compareSync(pwd, this.password);
  }

  password_setPlain(pwd) {
    pwd = applyCustomSaltToPassword(pwd);
    // crypt
    let salt = bcrypt.genSaltSync(parseInt(nconf.get('PWD_SALT')));
    pwd = bcrypt.hashSync(pwd, salt);
    this.password = pwd;
  }
}

User.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  createdAt: {
    allowNull: true,
    type: Sequelize.DATE,
  },
  updatedAt: {
    allowNull: true,
    type: Sequelize.DATE,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  nickname: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  level: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 10, // account
  },
  level_desc: {
    type: new DataTypes.VIRTUAL(DataTypes.STRING, ['level']),
    get: function () {
      return levelToString(this.get('level'));
    }
  },
  level_isAdmin: {
    type: new DataTypes.VIRTUAL(DataTypes.BOOLEAN, ['level']),
    get: function () {
      return this.get('level') <= LEVEL_ADMIN;
    }
  },
  level_isStaff: {
    type: new DataTypes.VIRTUAL(DataTypes.BOOLEAN, ['level']),
    get: function () {
      return this.get('level') <= LEVEL_STAFF;
    }
  },
  level_isAccount: {
    type: new DataTypes.VIRTUAL(DataTypes.BOOLEAN, ['level']),
    get: function () {
      return this.get('level') <= LEVEL_ACCOUNT;
    }
  },
  login_tryCount: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  login_tryWait: {
    type: Sequelize.DATE,
    allowNull: true,
  },
}, {
  // options
  sequelize: mainDb,
  modelName: 'gl_userss',
  tableName: 'gl_userss',
});

exports.model = User;