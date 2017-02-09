const database = require('../../database');
const collection = database.collection('users');
const user = require('./user');
const { ObjectId } = require('mongodb');

module.exports = {
  addUser: function ({ email, name }) {
    const changes = user.newUser(name, email);
    return collection.updateOne({ email }, { $set: changes }, { upsert: true })
      .then(() => collection.findOne({ email }))
      .then(retrievedUser => user(retrievedUser))
  },
  getUserByEmail: function (email) {
    return collection.findOne({ email })
      .then((res) => res ? user(res) : null);
  },
  getUserById: function (id) {
    return collection.findOne({ _id: ObjectId(id) })
      .then((res) => res ? user(res) : null);
  },
  updateUser: function (original, updates) {
    return collection.updateOne({ _id: original.id }, { $set: updates })
      .then(() => collection.findOne({ _id: original.id }))
      .then(retrievedUser => user(retrievedUser))
  },
  getAll: function () {
    return collection.find()
      .then((results) => results.toArray())
      .then((results) => results.map((doc) => user(doc)));
  }
};
