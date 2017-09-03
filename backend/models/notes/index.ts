import { ObjectID } from 'mongodb';
import * as R from 'ramda';

import { encrypt, decrypt } from './encryption';
import database from '../../database';
import note, { Note, newNote } from './note';
import notes, { Notes } from './notes';

const collection: any = database.collection('notes');

export default {
  addNote(user, skillId, noteText): PromiseLike<Note> {
    return collection.insertOne(encrypt(newNote(user.id, skillId, noteText)))
      .then(({ insertedId }) => collection.findOne({ _id: new ObjectID(insertedId) }))
      .then(res => (res ? note(decrypt(res)) : null));
  },
  getNotes(noteIds = []): PromiseLike<Notes> {
    return collection.find({ _id: { $in: R.map(i => new ObjectID(i), noteIds) } })
      .then(res => res.toArray())
      .then(R.map(decrypt))
      .then(notes);
  },
  getNote(noteId: string): Promise<Note> {
    return collection.findOne({ _id:  new ObjectID(noteId) })
      .then(res => (res ? note(decrypt(res)) : null));
  },
  updateNote(update: any): Promise<Note> {
    return collection.updateOne(
      { _id: new ObjectID(update.id) },
      { $set: R.omit(['id'], encrypt(update)) })
      .then(() => collection.findOne({ _id: new ObjectID(update.id) }))
      .then(res => (res ? note(decrypt(res)) : null));
  },
};
