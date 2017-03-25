const axios = require('axios');
const querystring = require('querystring');

const MAIL_DOMAIN = process.env.MAIL_DOMAIN;
const MAIL_API_KEY = process.env.MAIL_API_KEY;

const getData = (response) => response.data;

module.exports.sendMail = ({ recipients, subject, body }) => {
  // To NOT send emails (say as part of your test) don't set the API key
  if (!MAIL_DOMAIN || !MAIL_API_KEY) {
    return Promise.reject({ message: 'WAT? Missing credentials to send an email. Need MAIL_DOMAIN & MAIL_API_KEY' });
  }
  const options = {
    auth: {
      username: 'api',
      password: MAIL_API_KEY,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  };

  const data = {
    from: `Skills Matrix <postmaster@${MAIL_DOMAIN}>`,
    to: [].concat(recipients),
    subject: subject,
    text: body,
  };
  return axios.post(`https://api.mailgun.net/v3/${MAIL_DOMAIN}/messages`, querystring.stringify(data), options)
    .then(getData, console.error);
};
