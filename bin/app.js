const program = require('commander');
const pkg = require('../package.json');
const chalk = require('chalk');
const { handleError, mainDbEndFinally } = require('./common');

program
  .version(pkg.version)
  .command('admin-create', 'Creates database and setup first admin user.')
  .command('connect-test', 'Tests database connection.')
  .command('test', 'Test example CLI command', { noHelp: true })
  .command('help', 'Show this help', { isDefault: true });

try {
  if (!process.argv.slice(2).length) {
    console.log(chalk.red('please type the command...'));
  }
  program.parse(process.argv);
} catch (e) {
  handleError(e);
  mainDbEndFinally();
}
