const expect = require('expect')
// required to env
const { nconf } = require('../../../config.js')
const { mainDbEndTest } = require('../common')

const UserModule = require('../../models/gl_user')
const User = UserModule.model

describe('gl_user tests', () => {
  test('Config file has salts', async () => {
    expect(nconf.get('PWD_SALT')).toBeTruthy()
    expect(nconf.get('PWD_SALT_TEMPLATE')).toBeTruthy()
  })

  test('Password crypt compare', async () => {
    const user = User.build()
    // set
    const pwd = 'hello world'
    user.password_setPlain(pwd)
    expect(user.password).not.toBe(pwd)
    // compare
    expect(user.password_compare(pwd)).toBeTruthy()
    expect(user.password_compare('world hello')).toBeFalsy()
  })

  test('Sequelize simple test', async () => {
    var user = {
      name: 'Carlos',
      nickname: 'Carlos',
      email: 'example@example.com',
      level: UserModule.LEVEL_ACCOUNT,
    }
    user = User.build(user)
    expect(user.loginTryWait).toBeFalsy()
    expect(user.loginTryCount).not.toBeNull()
    // account
    expect(user.levelIsAccount).toBeTruthy()
    expect(user.levelIsStaff).toBeFalsy()
    expect(user.levelIsAdmin).toBeFalsy()
    expect(user.levelDesc).toEqual('Conta')
    // staff
    user.level = UserModule.LEVEL_STAFF
    expect(user.levelIsAccount).toBeTruthy()
    expect(user.levelIsStaff).toBeTruthy()
    expect(user.levelIsAdmin).toBeFalsy()
    expect(user.levelDesc).toEqual('Gestão')
    // admin
    user.level = UserModule.LEVEL_ADMIN
    expect(user.levelIsAccount).toBeTruthy()
    expect(user.levelIsStaff).toBeTruthy()
    expect(user.levelIsAdmin).toBeTruthy()
    expect(user.levelDesc).toEqual('Administrador')
    await user.save()
    await user.destroy()
  })

  afterAll(async () => {
    await mainDbEndTest()
  })
})
