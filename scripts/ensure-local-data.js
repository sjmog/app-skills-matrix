const Promise = require('bluebird');
const skillsData = require('../test/fixtures/skills');
const templatesData = require('../test/fixtures/templates');

const database = require('../backend/database');

const templatesCollection = database.collection('templates');
const skillsCollection = database.collection('skills');
const clearDb = () => Promise.all([templatesCollection.removeMany({}), skillsCollection.removeMany({})]);

const ensureLocalEnv = () =>
  (process.env.NODE_ENV === 'local'
    ? Promise.resolve()
    : Promise.reject(new Error("Node ENV isn't local")));

ensureLocalEnv()
  .then(clearDb)
  .then(() => skillsCollection.insertMany(skillsData))
  .then(() => templatesCollection.insertMany(templatesData))
  .then(() => {
    console.log('Sample data added');
    process.exit();
  })
  .catch(err => {
    console.log('There was a problem loading sample data', err);
    process.exit(1)
  });
