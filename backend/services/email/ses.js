import AWS from 'aws-sdk';
import Promise from 'bluebird';

const sesRegion = process.env.SES_REGION;

const getSES = function getSES() {
  const sesConfig = { region: sesRegion };
  AWS.config.update(sesConfig);

  return new AWS.SES();
};

export default ({ recipients, subject, body }) => {
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

  return new Promise((resolve, reject) => getSES().sendEmail(data, err => (err ? reject(err) : resolve())));
};
