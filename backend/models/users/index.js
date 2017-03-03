const { ObjectId } = require('mongodb');

const database = require('../../database');
const user = require('./user');
const { templates } = require('../matrices');

const collection = database.collection('users');

const getUserById = (id, hydrate) =>
  collection.findOne({ _id: ObjectId(id) })
    .then(hydrate);

const hydrateUser = (unhydratedUser) => {
  if (!unhydratedUser) {
    return null;
  }

  const hydrationFuncs = [];
  hydrationFuncs.push(unhydratedUser.templateId ? templates.getById(unhydratedUser.templateId) : Promise.resolve({}));
  hydrationFuncs.push(unhydratedUser.mentorId ? getUserById(unhydratedUser.mentorId, mentor => user(mentor)) : Promise.resolve({}));
  return Promise.all(hydrationFuncs)
    .then(([template, mentor]) => user(Object.assign({}, unhydratedUser, { template, mentor })));
};

module.exports = {
  addUser: ({ email, name }) => {
    const changes = user.newUser(name, email);
    return collection.updateOne({ email }, { $set: changes }, { upsert: true })
      .then(() => collection.findOne({ email }))
      .then(hydrateUser)
  },
  getUserByEmail: (email) =>
    collection.findOne({ email })
      .then(hydrateUser),
  getUserById: (id) => getUserById(id, hydrateUser),
  updateUser: (original, updates) =>
    collection.updateOne({ _id: original.id }, { $set: updates })
      .then(() => collection.findOne({ _id: original.id }))
      .then(hydrateUser),
  getAll: () =>
    collection.find()
      .then((results) => results.toArray())
      .then((results) => results.map((doc) => user(doc))),
};
