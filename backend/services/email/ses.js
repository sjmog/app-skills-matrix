const AWS = require('aws-sdk');
const Promise = require('bluebird');

const sesRegion = process.env.SES_REGION;
const roleArn = process.env.SES_ROLE_ARN;
const roleSessionName = process.env.SES_SESSION_NAME;

const getSES = function getSES() {
  const sesConfig = { region: sesRegion };
  const stsConfig = {
    RoleArn: roleArn,
    RoleSessionName: roleSessionName,
    DurationSeconds: 900,
  };

  AWS.config.update(sesConfig);
  AWS.config.credentials = new AWS.EC2MetadataCredentials();
  AWS.config.credentials = new AWS.TemporaryCredentials(stsConfig);

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
