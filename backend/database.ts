import * as mongodb from 'mongodb';
import { memoize } from 'ramda';
import { ObjectID } from 'bson';

const databaseUrl: string = process.env.MONGO_URL || 'mongodb://localhost:27017/skillz';

const connect = memoize(() => mongodb.MongoClient.connect(databaseUrl));
const getCollection = memoize(collection => connect().then(db => db.collection(collection)));

export type DatabaseObject = { _id?: ObjectID };

export default {
  connect,
  collection: (collection): any => new Proxy({}, {
    get: (object, methodName) => (...args) =>
      getCollection(collection)
        .then(c => c[methodName](...args)),
  }),
};
