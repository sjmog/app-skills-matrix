// @flow

import { MongoClient, ObjectId } from 'mongodb';
import { memoize } from 'ramda';

const databaseUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/skillz';

const connect = memoize(() => MongoClient.connect(databaseUrl));
const getCollection = memoize(collection => connect().then(db => db.collection(collection)));

export type DatabaseObject = { _id: ObjectId }

export default {
  connect,
  collection: (collection: any) => new Proxy({}, {
    get: (object, methodName) => (...args) =>
      getCollection(collection)
        .then(c => c[methodName](...args)),
  }),
};
