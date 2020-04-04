const expect = require('expect');
// required to env
const { nconf } = require('../../../config.js');
const { mainDbEndTest } = require('../common');

const UserModule = require('../../models/gl_user');
const User = UserModule.model;

describe('gl_user tests', () => {

  test('Config file has salts', async () => {
    expect(nconf.get('PWD_SALT')).toBeTruthy();
    expect(nconf.get('PWD_SALT_TEMPLATE')).toBeTruthy();
  });

  test('Password crypt compare', async () => {
    const user = User.build();
    // set
    const pwd = 'hello world';
    user.password_setPlain(pwd);
    expect(user.password).not.toBe(pwd);
    // compare
    expect(user.password_compare(pwd)).toBeTruthy();
    expect(user.password_compare('world hello')).toBeFalsy();
  });

  test.only('Sequelize simple test', async () => {
    var user = {
      name: 'Carlos',
      nickname: 'Carlos',
      email: 'example@example.com',
      level: UserModule.LEVEL_ACCOUNT,
    };
    user = User.build(user);
    expect(user.login_tryWait).toBeFalsy();
    expect(user.login_tryCount).not.toBeNull();
    // account
    expect(user.level_isAccount).toBeTruthy();
    expect(user.level_isStaff).toBeFalsy();
    expect(user.level_isAdmin).toBeFalsy();
    expect(user.level_desc).toEqual('Conta');
    // staff
    user.level = UserModule.LEVEL_STAFF;
    expect(user.level_isAccount).toBeTruthy();
    expect(user.level_isStaff).toBeTruthy();
    expect(user.level_isAdmin).toBeFalsy();
    expect(user.level_desc).toEqual('Gestão');
    // admin
    user.level = UserModule.LEVEL_ADMIN;
    expect(user.level_isAccount).toBeTruthy();
    expect(user.level_isStaff).toBeTruthy();
    expect(user.level_isAdmin).toBeTruthy();
    expect(user.level_desc).toEqual('Administrador');
    console.log('here 1');
    await user.save();
    console.log('here 2');
    await user.delete();
    console.log('here 3');
  });

  afterAll(async () => {
    await mainDbEndTest();
  });

});
