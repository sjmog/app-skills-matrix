import mailgun from './mailgun';
import ses from './ses';

const MAIL_PROVIDER = process.env.MAIL_PROVIDER;

const providers = {
  mailgun: mailgun.sendMail,
  ses: ses.sendMail,
};

export default ({ recipients, subject, body }) => {
  const emailProviderSendMailFn = providers[MAIL_PROVIDER];
  if (!emailProviderSendMailFn) {
    return Promise.resolve({});
  }

  return emailProviderSendMailFn({ recipients, subject, body }).catch(console.error);
};
