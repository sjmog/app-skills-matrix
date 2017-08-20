import { ObjectID } from 'mongodb';

import { encrypt, decrypt } from './encryption';
import database from '../../database';
import note, { Note, newNote } from './note';

const collection = database.collection('notes');

// collection.ensureIndex({ 'skill.id': 1 }, { background: true });
// collection.ensureIndex({ 'evaluation.id': 1 }, { background: true });
// collection.ensureIndex({ 'user.id': 1 }, { background: true });
// collection.ensureIndex({ type: 1 }, { background: true });
// collection.ensureIndex({ 'skill.id': 1, 'evaluation.id': 1, 'user.id': 1, type: 1 }, { background: true, unique: true });

export default {
  addNote: (user, skillId, noteText): Promise<Note> => {
    return collection.insertOne(encrypt(newNote(user.id, skillId, noteText)))
      .then(({ insertedId }) => collection.findOne({ _id: new ObjectID(insertedId) }))
      .then(res => (res ? note(decrypt(res)) : null));
  },
};
