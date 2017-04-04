const AWS = require('aws-sdk');
const Promise = require('bluebird');

const sesRegion = process.env.SES_REGION;
const roleArn = process.env.SES_ROLE_ARN;
const roleSessionName = process.env.SES_SESSION_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;

const getSES = function getSES() {
  if (!accessKeyId && !roleArn) {
    throw new Error('Credentials must be provided in either process.env.SES_ROLE_ARN or process.env.AWS_ACCESS_KEY_ID');
  }

  const sesConfig = { region: sesRegion };
  AWS.config.update(sesConfig);

  if (!accessKeyId) {
    const stsConfig = {
      RoleArn: roleArn,
      RoleSessionName: roleSessionName,
      DurationSeconds: 900,
    };

    AWS.config.credentials = new AWS.EC2MetadataCredentials();
    AWS.config.credentials = new AWS.TemporaryCredentials(stsConfig);
  }

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
