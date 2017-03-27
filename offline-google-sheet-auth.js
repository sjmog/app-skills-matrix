const pify = require('pify');
const fs = pify(require('fs'));
const readline = require('readline');
const googleAuth = require('google-auth-library');

const pifyNoErr = (fn) => (...args) => new Promise((resolve) => fn(...args, resolve));

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const tPath = './google-sheets-token.json';

function getNewToken(credentials) {
  const clientSecret = credentials.installed.client_secret;
  const clientId = credentials.installed.client_id;
  const redirectUrl = credentials.installed.redirect_uris[0];

  const auth = new googleAuth();
  const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  const authUrl = oauth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });
  console.log('Authorise this tool by visiting this URL: ', authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = pifyNoErr(rl.question.bind(rl));
  return question('Enter the code from that page here: ')
    .then((code) => {
      rl.close();
      return pify(oauth2Client.getToken.bind(oauth2Client))(code);
    })
    .then((token) => {
      oauth2Client.credentials = token;
      storeToken(token);
      return oauth2Client;
    })
    .catch((err) => {
      console.error('Error trying to retrieve access token: ' + err);
      process.exit(1);
    });
}

function storeToken(token) {
  fs.writeFile(tPath, JSON.stringify(token));
  const message = 'Token stored in ' + tPath;
  console.log(message);
}

fs.readFile('client_secret.json')
  .then((secretsJSON) => {
    if (!secretsJSON) {
      throw new Error('Must have google api secret in json file: "client_secret.json", see README.md');
    }
    getNewToken(JSON.parse(secretsJSON));
  })
  .catch((err) => console.error('Error: ' + err));
