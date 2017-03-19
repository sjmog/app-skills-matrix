const { ObjectId } = require('mongodb');

const database = require('../../database');
const user = require('./user');

const collection = database.collection('users');

collection.ensureIndex({ email: 1 }, { unique: true, background: true });
collection.ensureIndex({ mentorId: 1 }, { background: true });

module.exports = {
  addUser: ({ email, name, avatarUrl }) => {
    const changes = user.newUser(name, email, avatarUrl);
    return collection.updateOne({ email }, { $set: changes }, { upsert: true })
      .then(() => collection.findOne({ email }))
      .then(retrievedUser => user(retrievedUser))
  },
  getUserByEmail: (email) => {
    return collection.findOne({ email })
      .then((res) => res ? user(res) : null);
  },
  getUserById: (id) => {
    return collection.findOne({ _id: ObjectId(id) })
      .then((res) => res ? user(res) : null);
  },
  updateUser: (original, updates) => {
    return collection.updateOne({ _id: ObjectId(original.id) }, { $set: updates })
      .then(() => collection.findOne({ _id: ObjectId(original.id) }))
      .then((res) => res ? user(res) : null);
  },
  getAll: () => {
    return collection.find()
      .then((res) => res.toArray())
      .then((res) => res.map((doc) => user(doc)));
  },
  getByMentorId: (id) => {
    return collection.find({ mentorId: id })
      .then((res) => res.toArray())
      .then((res) => res.map((doc) => user(doc)))
  },
};
