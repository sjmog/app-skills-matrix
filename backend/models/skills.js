const database = require('../database')
const collection = database.collection('skills')

module.exports = {
  list: (filter) => collection.find(filter).then(result => result.toArray()),
  create: (data) => collection.insert(data),
  read: (id) => collection.findOne({ _id: database.ObjectId(id) }),
  update: (id, data) => collection.update({ _id: database.ObjectId(id) }, { set: data }, { upsert: true }),
  delete: (id) => collection.deleteOne({ _id: database.ObjectId(id) })
}