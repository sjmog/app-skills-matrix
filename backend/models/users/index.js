const database = require('../../database');
const collection = database.collection('users');
const user = require('./user');

module.exports = {
  addUser: function ({ email, name }) {
    return collection.updateOne({ email }, { $set: { email, name } }, { upsert: true })
      .then(() => collection.findOne({ email }))
      .then(retrievedUser => user(retrievedUser))
  }
};
