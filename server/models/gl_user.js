const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nconf = require('nconf');
const moment = require('moment');
const { Sequelize, DataTypes } = require('sequelize');

const { randomString } = require('../helpers/utils');
const { mainDb } = require('../database/main_connection');
const { BaseModel, jsonSerializer } = require('./base_model');
const { RecoverPasswordMail } = require('../mails/auth-mail');

// level
const LEVEL_ADMIN = 1;
const LEVEL_STAFF = 5;
const LEVEL_ACCOUNT = 10;

exports.LEVEL_ADMIN = LEVEL_ADMIN;
exports.LEVEL_STAFF = LEVEL_STAFF;
exports.LEVEL_ACCOUNT = LEVEL_ACCOUNT;
exports.LEVEL_ALL = [LEVEL_ADMIN, LEVEL_STAFF, LEVEL_ACCOUNT];

const levelToString = value => {
  switch (parseInt(value)) {
    case LEVEL_ADMIN:
      return 'Administrador';

    case LEVEL_STAFF:
      return 'Gestão';

    case LEVEL_ACCOUNT:
      return 'Conta';
  }
  return 'Desconhecido';
};
exports.levelToString = levelToString;

/**
 * Applies a custom template string to the password
 * @param {String} pwd
 */
const applyCustomSaltToPassword = pwd => {
  let template = nconf.get('PWD_SALT_TEMPLATE');
  if (!template) {
    template = 'salt{pwd}salt';
  }
  return template.replace('{pwd}', pwd);
};

// model
const modelName = 'gl_user';

class MyModel extends BaseModel {
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

  async recover_newToken() {
    const { model: UserRecover } = require('./gl_user_recover');
    return await UserRecover.create({
      userId: this.id,
      expiresWhen: moment().add(1, 'day').toDate(), // TODO colocar em config
      token: randomString(64),
    });
  }

  async recover_generateAndSend(isInvite, req, res) {
    const reset = await this.recover_newToken();
    const mail = new RecoverPasswordMail(this, reset, isInvite);
    await mail.send(req, res);
  }
}

MyModel.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    createdAt: {
      type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
    name: {
      type: Sequelize.STRING,
    },
    nickname: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
    },
    blocked: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    level: {
      type: Sequelize.INTEGER,
      defaultValue: 10, // account
    },
    levelDesc: {
      type: new DataTypes.VIRTUAL(DataTypes.STRING, ['level']),
      get: function () {
        return levelToString(this.get('level'));
      },
    },
    levelIsAdmin: {
      type: new DataTypes.VIRTUAL(DataTypes.BOOLEAN, ['level']),
      get: function () {
        return this.get('level') <= LEVEL_ADMIN;
      },
    },
    levelIsStaff: {
      type: new DataTypes.VIRTUAL(DataTypes.BOOLEAN, ['level']),
      get: function () {
        return this.get('level') <= LEVEL_STAFF;
      },
    },
    levelIsAccount: {
      type: new DataTypes.VIRTUAL(DataTypes.BOOLEAN, ['level']),
      get: function () {
        return this.get('level') <= LEVEL_ACCOUNT;
      },
    },
    loginTryCount: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    loginTryWait: {
      type: Sequelize.DATE,
    },
  },
  {
    // options
    sequelize: mainDb,
    modelName: modelName,
    tableName: modelName,
  }
);

const scopes = {
  def: {
    include: ['id', 'name', 'nickname', 'email', 'level', 'levelDesc'],
  },
  account: {
    include: ['id', 'name', 'nickname'],
  },
  admin: {
    exclude: ['password'],
  },
};

exports.model = MyModel;
exports.modelName = modelName;
exports.jsonSerializer = async (value, scopeName) => {
  if (!scopeName) {
    scopeName = 'def';
  }
  if (!scopes[scopeName]) {
    scopeName = 'def';
  }
  return await jsonSerializer(value, scopes[scopeName], scopeName);
};
