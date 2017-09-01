import { ObjectID } from 'mongodb';
import * as R from 'ramda';

import database from '../../database';
import user, { newUser, User } from './user';
import users, { Users } from './users';

const collection: any = database.collection('users');

collection.ensureIndex({ email: 1 }, { background: true });
collection.ensureIndex({ username: 1 }, { unique: true, background: true });
collection.ensureIndex({ mentorId: 1 }, { background: true });

type AddUser = {
  email: string,
  name: string,
  avatarUrl: string,
  username: string,
};

export default {
  addUser: ({ email, name, avatarUrl, username }: AddUser): Promise<User> => {
    const changes = newUser(name, email, avatarUrl, username);
    return collection.updateOne({ username }, { $set: changes }, { upsert: true })
      .then(() => collection.findOne({ username }))
      .then(retrievedUser => user(retrievedUser));
  },
  getUserByUsername: (username: string): Promise<User> => collection.findOne({ username })
    .then(res => (res ? user(res) : null)),
  getUserById: (id: string): Promise<User> => collection.findOne({ _id: new ObjectID(id) })
    .then(res => (res ? user(res) : null)),
  getUsersById: (ids: string[]) : Promise<Users> => collection.find({ _id: { $in: R.map(i => new ObjectID(i), ids) } })
     .then(res => res.toArray())
     .then(users),
  updateUser: (original: { id: string }, updates: any) => collection.updateOne({ _id: new ObjectID(original.id) }, { $set: updates })
    .then(() => collection.findOne({ _id: new ObjectID(original.id) }))
    .then(res => (res ? user(res) : null)),
  getAll: (): Promise<User[]> => collection.find()
    .then(res => res.toArray())
    .then(res => res.map(doc => user(doc))),
  getByMentorId: (id: string) => collection.find({ mentorId: id })
    .then(res => res.toArray())
    .then(res => res.map(doc => user(doc))),
};