// @flow

import mailgun from './mailgun';
import ses from './ses';

export type Email = {
  recipients: string | Array<string>,
  subject: string,
  body: string
}

const MAIL_PROVIDER = (process.env.MAIL_PROVIDER: any);

const providers = {
  mailgun: mailgun.sendMail,
  ses: ses.sendMail,
};

export default ({ recipients, subject, body }: Email): Promise<> => {
  const emailProviderSendMailFn = providers[MAIL_PROVIDER];
  if (!emailProviderSendMailFn) {
    return Promise.resolve({});
  }

  return emailProviderSendMailFn({ recipients, subject, body }).catch(console.error);
};
