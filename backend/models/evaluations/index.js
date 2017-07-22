import { ObjectId } from 'mongodb';

import database from '../../database';
import evaluation from './evaluation';
import { encrypt, decrypt } from './encryption';

const evaluationsCollection = database.collection('evaluations');

evaluationsCollection.ensureIndex({ 'user.id': 1 }, { background: true });

export default {
  addEvaluation(newEvaluation) {
    return evaluationsCollection.insertOne(encrypt(newEvaluation.dataModel))
      .then(({ insertedId }) => evaluationsCollection.findOne({ _id: new ObjectId(insertedId) }))
      .then(res => (res ? evaluation(decrypt(res)) : null));
  },
  importEvaluation(rawEvaluation) {
    return evaluationsCollection.insertOne(encrypt(rawEvaluation))
      .then(({ insertedId }) => evaluationsCollection.findOne({ _id: new ObjectId(insertedId) }))
      .then(res => (res ? evaluation(decrypt(res)) : null));
  },
  getEvaluationById(id) {
    return evaluationsCollection.findOne({ _id: ObjectId(id) })
      .then(res => (res ? evaluation(decrypt(res)) : null));
  },
  getByUserId(userId) {
    return evaluationsCollection.find({ 'user.id': userId })
      .then(res => res.toArray())
      .then(res => res.map(e => evaluation(decrypt(e))));
  },
  getLatestByUserId(userId) {
    return evaluationsCollection.findOne({ 'user.id': userId }, { sort: { createdDate: -1 }, limit: 1 })
      .then(res => (res ? evaluation(decrypt(res)) : null));
  },
  updateEvaluation(updatedEvaluation) {
    return evaluationsCollection.updateOne(
      { _id: ObjectId(updatedEvaluation.id) },
      { $set: encrypt(updatedEvaluation) })
      .then(() => evaluationsCollection.findOne({ _id: ObjectId(updatedEvaluation.id) }))
      .then(res => (res ? evaluation(decrypt(res)) : null));
  },
};
