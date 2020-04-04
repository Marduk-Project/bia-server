const fs = require('fs');
const { nconf, filepath } = require('../../../config.js');

/**
 * Get config data
 */
exports.getConfig = (req, res, next) => {
  let config = fs.readFileSync(filepath, { encoding: 'utf-8' });
  res.sendJsonOK({
    file_content: config,
  });
}

/**
 * Config update
 */
exports.postConfig = (req, res, next) => {
  try {
    const config = JSON.parse(req.body.file_content);
    fs.writeFile(filepath, req.body.file_content, (err) => {
      if (err) {
        next(err);
      } else {
        res.sendJsonOK();
      }
    });
  } catch (err) {
    throw new Error('Formato do arquivo inválido ou erro ao salvar dados.');
  }
}
