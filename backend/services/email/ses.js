const AWS = require('aws-sdk');
const Promise = require('bluebird');

const sesRegion = process.env.SES_REGION;

const getSES = function getSES() {
  const sesConfig = { region: sesRegion };
  AWS.config.update(sesConfig);

  return new AWS.SES();
};

module.exports.sendMail = ({ recipients, subject, body }) => {
  const data = {
    Source: 'Skills Matrix <skills.matrix@tes.com>',
    Destination: {
      ToAddresses: [].concat(recipients),
    },
    Message: {
      Subject: {
        Data: subject,
      },
      Body: {
        Text: {
          Data: body,
        },
      },
    },
  };

  return new Promise((resolve, reject) => getSES().sendEmail(data, (err) => err ? reject(err) : resolve()));
};
