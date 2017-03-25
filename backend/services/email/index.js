const mailgun = require('./mailgun');
const ses = require('./ses');

const MAIL_PROVIDER = process.env.MAIL_PROVIDER;

const providers = {
  mailgun: mailgun.sendMail,
  ses: ses.sendMail,
};

module.exports.sendMail = ({ recipients, subject, body }) => {
  const emailProvider = providers[MAIL_PROVIDER];
  if (!emailProvider) {
    return Promise.resolve({});
  }

  return emailProvider({ recipients, subject, body });
};
