const database = require('../../database');
const collection = database.collection('users');
const user = require('./user');

module.exports = {
  addUser: function ({ email, firstName, lastName }) {
    return collection.insertOne({ email, firstName, lastName })
      .then((res) => user({ _id: res.insertedId, email, firstName, lastName }));
  },
  loginViaOauth: function (email) {
    // not sure I like this but should do for now (prevents the bootstraping issue
    return collection.updateOne({ email }, { $set: { email } }, { upsert: true })
      .then(() => collection.findOne({ email }))
      .then(retrievedUser => user(retrievedUser))
  }
};
