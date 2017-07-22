// @flow
import { ObjectId } from 'mongodb';

import database from '../../database';
import user, { newUser } from './user';
import type { User } from './user';

const collection = database.collection('users');

collection.ensureIndex({ email: 1 }, { background: true });
collection.ensureIndex({ username: 1 }, { unique: true, background: true });
collection.ensureIndex({ mentorId: 1 }, { background: true });

type AddUser = {
  email: string,
  name: string,
  avatarUrl: string,
  username: string,
}

export default {
  addUser: ({ email, name, avatarUrl, username }: AddUser): Promise<User> => {
    const changes = newUser(name, email, avatarUrl, username);
    return collection.updateOne({ username }, { $set: changes }, { upsert: true })
      .then(() => collection.findOne({ username }))
      .then(retrievedUser => user(retrievedUser));
  },
  getUserByUsername: (username: string): Promise<User> => collection.findOne({ username })
    .then(res => (res ? user(res) : null)),
  getUserById: (id: string): Promise<User> => collection.findOne({ _id: ObjectId(id) })
    .then(res => (res ? user(res) : null)),
  updateUser: (original: { id: string }, updates: any) => collection.updateOne({ _id: ObjectId(original.id) }, { $set: updates })
    .then(() => collection.findOne({ _id: ObjectId(original.id) }))
    .then(res => (res ? user(res) : null)),
  getAll: () => collection.find()
    .then(res => res.toArray())
    .then(res => res.map(doc => user(doc))),
  getByMentorId: (id: string) => collection.find({ mentorId: id })
    .then(res => res.toArray())
    .then(res => res.map(doc => user(doc))),
};
