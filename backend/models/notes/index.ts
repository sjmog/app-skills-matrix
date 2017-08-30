import { ObjectID } from 'mongodb';
import * as R from 'ramda';

import { encrypt, decrypt } from './encryption';
import database from '../../database';
import note, { Note, newNote } from './note';
import notes from './notes';

const collection = database.collection('notes');

// collection.ensureIndex({ 'skill.id': 1 }, { background: true });
// collection.ensureIndex({ 'evaluation.id': 1 }, { background: true });
// collection.ensureIndex({ 'user.id': 1 }, { background: true });
// collection.ensureIndex({ type: 1 }, { background: true });
// collection.ensureIndex({ 'skill.id': 1, 'evaluation.id': 1, 'user.id': 1, type: 1 }, { background: true, unique: true });

export default {
  addNote: (user, skillId, noteText): PromiseLike<Note> => { // TODO: What does PromiseLike mean?
    return collection.insertOne(encrypt(newNote(user.id, skillId, noteText)))
      .then(({ insertedId }) => collection.findOne({ _id: new ObjectID(insertedId) }))
      .then(res => (res ? note(decrypt(res)) : null));
  },
  getNotes: (noteIds = []): PromiseLike<any> => { // TODO: Fix this type.
    return collection.find({ _id: { $in: R.map(i => new ObjectID(i), noteIds) } })
      .then(res => res.toArray())
      .then(R.map(decrypt))
      .then(notes);
  },
  getNote: (noteId: string): Promise<any> => {
    return collection.findOne({ _id:  new ObjectID(noteId) })
      .then(res => (res ? note(decrypt(res)) : null));
  },
  updateNote: (update: any): Promise<any> => {
    return collection.updateOne(
      { _id: new ObjectID(update.id) },
      { $set: R.omit(['id'], encrypt(update)) })
      .then(() => collection.findOne({ _id: new ObjectID(update.id) }))
      .then(res => (res ? note(decrypt(res)) : null));
  },
};
