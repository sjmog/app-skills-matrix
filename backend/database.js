const { ObjectId, MongoClient } = require('mongodb');
const { memoize } = require('ramda');

const databaseUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/skillz';

const connect = memoize(() => MongoClient.connect(databaseUrl));
const getCollection = memoize(collection => connect().then(db => db.collection(collection)));

module.exports = {
  connect,
  ObjectId,
  collection: (collection) => new Proxy({}, {
    get: (object, methodName) => (...args) =>
      getCollection(collection)
        .then(collection => collection[methodName](...args))
  })
};