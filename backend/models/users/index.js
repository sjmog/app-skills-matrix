const database = require('../../database');
const collection = database.collection('users');
const user = require('./user');

module.exports = {
  addUser: function ({ email, name }) {
    return collection.updateOne({ email }, { $set: { email, name } }, { upsert: true })
      .then(() => collection.findOne({ email }))
      .then(retrievedUser => user(retrievedUser))
  },
  getUser: function (email) {
    return collection.findOne({ email })
      .then((res) => res ? user(res) : null);
  },
  getAll: function () {
    return collection.find()
      .then((results) => results.toArray())
      .then((results) => results.map((doc) => user(doc)));
  }
};
