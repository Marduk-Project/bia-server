const nodemailer = require("nodemailer");
const marked = require("marked");
const path = require("path");
const nconf = require("nconf");

const transporter = nodemailer.createTransport({
  host: nconf.get("MAIL_HOST"),
  port: nconf.get("MAIL_PORT"),
  secure:
    nconf.get("MAIL_ENCRYPTION") == "tls" ||
    nconf.get("MAIL_ENCRYPTION") == "ssl",
  auth: {
    user: nconf.get("MAIL_USERNAME"),
    pass: nconf.get("MAIL_PASSWORD"),
  },
});

/**
 * Send mail
 * @param {object} mail
 * @param {string|array|undefined} mail.to
 * @param {string|array|undefined} mail.cc
 * @param {string|array|undefined} mail.bcc
 * @param {string} mail.subject
 * @param {string} mail.html
 * @returns {Promise}
 */
exports.sendMail = (mail) => {
  let mailOptions = {
    from: `"${nconf.get("MAIL_FROM_NAME")}" <${nconf.get(
      "MAIL_FROM_ADDRESS"
    )}>`,
    subject: mail.subject,
    html: mail.html,
  };
  if (mail.to) {
    mailOptions.to = mail.to;
  }
  if (mail.cc) {
    mailOptions.cc = mail.cc;
  }
  if (mail.bcc) {
    mailOptions.bcc = mail.bcc;
  }
  return transporter.sendMail(mailOptions);
};

/**
 * Returns markdown data
 * @param {object} res response
 * @param {string} template
 * @param {object} data
 * @param {object} options render options
 * @param {boolean} options.hideHeaderFooter default false
 * @returns {Promise}
 */
exports.markdownHtml = (res, template, data, options) => {
  return new Promise((resolve, reject) => {
    res.render(template, data, (err, html) => {
      if (err) {
        reject(err);
        return;
      }
      html = marked(html, { sanitize: false });
      if (!options || !options.hideHeaderFooter) {
        res.render("emails/layout/header.ejs", data, (err, header) => {
          if (err) {
            reject(err);
            return;
          }
          res.render("emails/layout/footer.ejs", data, (err, footer) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(`${header}${html}${footer}`);
          });
        });
      } else {
        resolve(html);
      }
    });
  });
};

/**
 * Base e-mail class
 * @property {string|array} [to=null]
 * @property {string|array} [cc=null]
 * @property {string|array} [bcc=null]
 * @property {string} [subject=null]
 * @property {string} [html=null]
 */
class BaseMail {
  constructor() {
    this.to = null;
    this.cc = null;
    this.bcc = null;
    this.subject = null;
    this.html = null;
  }

  /**
   * Parse the templates
   * @param {object} req - the request
   * @param {object} res - the response
   * @param {object} next - the chain
   * @returns {Promise}
   */
  buildBody(req, res, next) {
    return Promise.reject("Build not implemented!");
  }

  toMail() {
    return {
      to: this.to,
      cc: this.cc,
      bcc: this.bcc,
      subject: this.subject,
      html: this.html,
    };
  }

  /**
   * Sends the e-mail
   * @param {object} req - the request
   * @param {object} res - the response
   * @param {object} next - the chained
   * @returns {Promise}
   */
  send(req, res, next) {
    return this.buildBody(req, res, next).then(() => {
      return exports.sendMail(this.toMail());
    });
  }
}

exports.BaseMail = BaseMail;
