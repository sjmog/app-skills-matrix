// @flow
import { ObjectId } from 'mongodb';

import database from '../../database';
import evaluation from './evaluation';
import type { Evaluation, EvaluationUpdate } from './evaluation';
import { encrypt, decrypt } from './encryption';

const evaluationsCollection: any = database.collection('evaluations');

evaluationsCollection.ensureIndex({ 'user.id': 1 }, { background: true });

export default {
  addEvaluation(newEvaluation: Evaluation) {
    return evaluationsCollection.insertOne(encrypt(newEvaluation.dataModel()))
      .then(({ insertedId }) => evaluationsCollection.findOne({ _id: new ObjectId(insertedId) }))
      .then(res => (res ? evaluation(decrypt(res)) : null));
  },
  getEvaluationById(id: string) {
    return evaluationsCollection.findOne({ _id: ObjectId(id) })
      .then(res => (res ? evaluation(decrypt(res)) : null));
  },
  getByUserId(userId: string) {
    return evaluationsCollection.find({ 'user.id': userId })
      .then(res => res.toArray())
      .then(res => res.map(e => evaluation(decrypt(e))));
  },
  getLatestByUserId(userId: string) {
    return evaluationsCollection.findOne({ 'user.id': userId }, { sort: { createdDate: -1 }, limit: 1 })
      .then(res => (res ? evaluation(decrypt(res)) : null));
  },
  updateEvaluation(updatedEvaluation: EvaluationUpdate): Promise<Evaluation> {
    return evaluationsCollection.updateOne(
      { _id: ObjectId(updatedEvaluation.id) },
      { $set: encrypt(updatedEvaluation) })
      .then(() => evaluationsCollection.findOne({ _id: ObjectId(updatedEvaluation.id) }))
      .then(res => (res ? evaluation(decrypt(res)) : null));
  },
};
