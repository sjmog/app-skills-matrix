const mailgun = require('./mailgun');
const ses = require('./ses');

const MAIL_PROVIDER = process.env.MAIL_PROVIDER;

const providers = {
  mailgun: mailgun.sendMail,
  ses: ses.sendMail,
};

module.exports.sendMail = ({ recipients, subject, body }) => {
  const emailProviderSendMailFn = providers[MAIL_PROVIDER];
  if (!emailProviderSendMailFn) {
    return Promise.resolve({});
  }

  return emailProviderSendMailFn({ recipients, subject, body }).catch(console.error);
};
