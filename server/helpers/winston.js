const path = require('path');
const winston = require('winston');
const nconf = require('nconf');

require('winston-daily-rotate-file');

const { format } = require('logform');

const logFormatter = format.combine(
  format.timestamp(),
  format.printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
  })
);

const logPath = path.join(__dirname, '../../tmp/logs');

let transports = [];

if (nconf.get('APP_SAVE_LOG') == 'true') {
  transports = [
    new winston.transports.DailyRotateFile({
      filename: `${logPath}/%DATE%_error.log`,
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      level: 'error',
      colorize: false,
    }),
    new winston.transports.DailyRotateFile({
      filename: `${logPath}/%DATE%_combined.log`,
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      colorize: false,
    }),
  ]
}    

const logger = winston.createLogger({
  level: 'info',
  format: logFormatter,
  handleExceptions: true,
  transports,
  exitOnError: false,
});

if (nconf.get('NODE_ENV') !== 'production') { 
  logger.add(
    new winston.transports.Console({
      level: 'debug',
      timestamp: true,
      format: winston.format.simple(),
      colorize: true,
    })
  );
}

exports.logger = logger;
