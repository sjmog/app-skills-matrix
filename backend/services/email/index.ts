import mailgun from './mailgun';
import ses from './ses';

export type Email = {
  recipients: string | string[],
  subject: string,
  body: string,
};

const MAIL_PROVIDER = process.env.MAIL_PROVIDER;

const providers = {
  mailgun,
  ses,
};

export default ({ recipients, subject, body }: Email): Promise<{}> => {
  const emailProviderSendMailFn = providers[MAIL_PROVIDER];
  if (!emailProviderSendMailFn) {
    return Promise.resolve({});
  }

  return emailProviderSendMailFn({ recipients, subject, body }).catch(console.error);
};
