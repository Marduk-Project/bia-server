const moment = require('moment');

const mailer = require('./mailer');
const ConfigModel = require('../models/sy_config');

const BaseMail = mailer.BaseMail;

/**
 * Recovery password mail
 * @property {object} user
 * @property {object} resetToken
 * @property {boolean} [isInvite=false]
 */
class FormContactMail extends BaseMail {
  constructor(formContact, isResponse = false) {
    super();
    this.formContact = formContact;
    this.to = formContact.personEmail;
    this.replyTo = formContact.personEmail;
    this.isResponse = isResponse;
  }

  buildBody(req, res, next) {
    return new Promise((resolve, reject) => {
      const setup = async () => {
        // subject
        this.subject = this.isResponse
          ? `RES: ${this.formContact.subject} - ${req.app.locals.app_short_name}`
          : `Recebemos seu contato: ${this.formContact.subject} - ${req.app.locals.app_short_name}`;

        // bcc
        const mailsToCheck = await ConfigModel.model.findByCode(
          ConfigModel.common.CODE_GENERAL_NOTIFY_MAILS
        );
        if (mailsToCheck && mailsToCheck.valueString1) {
          this.bcc = mailsToCheck.valueString1.split(',');
        }

        // markdown
        mailer
          .markdownHtml(res, 'emails/form_contact/form_contact', {
            formContact: this.formContact,
            isResponse: this.isResponse,
          })
          .then(html => {
            this.html = html;
            resolve(html);
          })
          .catch(e => {
            reject(e);
          });
      };
      setup();
    });
  }
}

exports.FormContactMail = FormContactMail;
