const database = require('../database');
const collection = database.collection('users');

module.exports = {
  list: (filter) => collection.find(filter).then(result => result.toArray()),
  read: (id) => collection.findOne({ _id: database.ObjectId(id) }),
  update: (id, data) => collection.update({ _id: database.ObjectId(id) }, { set: data }, { upsert: true })
};