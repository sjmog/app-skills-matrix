import { ObjectId } from 'mongodb';

import database from '../../database';
import action, { newAction } from './action';

const collection = database.collection('actions');

collection.ensureIndex({ 'skill.id': 1 }, { background: true });
collection.ensureIndex({ 'evaluation.id': 1 }, { background: true });
collection.ensureIndex({ 'user.id': 1 }, { background: true });
collection.ensureIndex({ type: 1 }, { background: true });
collection.ensureIndex({ 'skill.id': 1, 'evaluation.id': 1, 'user.id': 1, type: 1 }, { background: true, unique: true });

export default {
  addAction: (type, user, skill, evaluation) => {
    const changes = newAction(type, user, skill, evaluation);
    return collection.insertOne(changes)
      .then(({ insertedId }) => collection.findOne({ _id: new ObjectId(insertedId) }))
      .then(retrievedAction => action(retrievedAction));
  },
  removeAction: (type, userId, skillId, evaluationId) => collection.deleteOne({ 'user.id': userId, 'skill.id': skillId, 'evaluation.id': evaluationId, type }),
  find: (userId, evaluationId, type) => {
    const query = { 'user.id': userId };
    if (evaluationId) {
      query['evaluation.id'] = evaluationId;
    }
    if (type) {
      query.type = type;
    }
    return collection.find(query).then(a => a.toArray()).then(list => list.map(action));
  },
};
