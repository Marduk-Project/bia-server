const mailer = require('./mailer');
const BaseMail = mailer.BaseMail;

/**
 * Recovery password mail
 * @property {object} user
 * @property {object} resetToken
 */
class RecoverPasswordMail extends BaseMail {

  constructor(user, resetToken) {
    super();
    this.user = user;
    this.resetToken = resetToken
    this.to = user.email;
  }

  buildBody(req, res, next) {
    return new Promise((resolve, reject) => {
      let jwt = {
        id: this.user.id,
        token: this.resetToken.token,
      }
      jwt = Buffer.from(JSON.stringify(jwt), 'utf-8').toString('base64');
      const url = res.appUrl(`auth/recover/${jwt}`);
      // calc
      mailer.markdownHtml(res, 'emails/auth/recover', {
        expiresWhen: this.resetToken.expiresWhen,
        url: url,
      })
        .then(html => {
          this.html = html;
          this.subject = `Recuperar a senha de ${this.user.name} - ${req.app.locals.app_short_name}`;
          resolve(html);
        })
        .catch(e => {
          reject(e);
        })
    });
  }

}

exports.RecoverPasswordMail = RecoverPasswordMail;