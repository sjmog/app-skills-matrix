const { ObjectId } = require('mongodb');

const database = require('../../database');
const user = require('./user');

const collection = database.collection('users');

collection.ensureIndex({ email: 1 }, { background: true });
collection.ensureIndex({ username: 1 }, { unique: true, background: true });
collection.ensureIndex({ mentorId: 1 }, { background: true });

module.exports = {
  addUser: ({ email, name, avatarUrl, username }) => {
    const changes = user.newUser(name, email, avatarUrl, username);
    return collection.updateOne({ username }, { $set: changes }, { upsert: true })
      .then(() => collection.findOne({ username }))
      .then(retrievedUser => user(retrievedUser));
  },
  getUserByUsername: username => collection.findOne({ username })
      .then(res => (res ? user(res) : null)),
  getUserById: id => collection.findOne({ _id: ObjectId(id) })
      .then(res => (res ? user(res) : null)),
  updateUser: (original, updates) => collection.updateOne({ _id: ObjectId(original.id) }, { $set: updates })
      .then(() => collection.findOne({ _id: ObjectId(original.id) }))
      .then(res => (res ? user(res) : null)),
  getAll: () => collection.find()
      .then(res => res.toArray())
      .then(res => res.map(doc => user(doc))),
  getByMentorId: id => collection.find({ mentorId: id })
      .then(res => res.toArray())
      .then(res => res.map(doc => user(doc))),
};
