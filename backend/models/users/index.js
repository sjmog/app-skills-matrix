const database = require('../../database');
const collection = database.collection('users');
const user = require('./user');

module.exports = {
  addUser: function ({ email, firstName, lastName }) {
    return collection.insertOne({ email, firstName, lastName })
      .then((res) => user({ id: res.insertedId, email, firstName, lastName }));
  }
};
