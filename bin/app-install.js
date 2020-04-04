const program = require('commander');
const validator = require('validator');
const { handleError, findAccount, rand, mainDbEndFinally, outputNotRunned } = require('./common');
const config = require('../config');
const chalk = require('chalk');
const { randomString } = require('../server/helpers/utils');

const UserModule = require('../server/models/user');
const { model: User } = UserModule;
let runStart = false;

const run = async (email, pwd, options) => {
  runStart = true;
  try {
    if (!validator.isEmail(email)) {
      throw new Error(`"${email}" is not a valid email.`);
    }
    if (!pwd) {
      pwd = randomString(8);
    }
    let user = await User.findOne({ email: email });
    if (user) {
      if (!options.force) {
        throw new Error(`User ${email} already exists.`);
      }
    } else {
      const name = email.split('@')[0];
      user = new User({
        name: name,
        nickname: name,
      });
    }
    user.email = email;
    user.setPlainPassword(pwd);
    user.level = UserModule.LEVEL_ADMIN;
    await user.save();
    await mainDbEndFinally();
    // end success
    console.log(chalk.green(`User ${user.email}/${user._id} created or updated with success! Password updated!`));
  } catch (e) {
    await mainDbEndFinally();
    handleError(e);
  }
}

program
  .arguments('<email> [pwd]')
  .option('-f --force', 'forces overwrite of the user data')
  .action(run);

try {
  program.parse(process.argv);
  if (!runStart) {
    outputNotRunned(program);
    mainDbEndFinally();
  }
} catch (e) {
  handleError(e);
  mainDbEndFinally();
}
