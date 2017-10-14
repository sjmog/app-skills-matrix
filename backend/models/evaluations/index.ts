import { ObjectID } from 'mongodb';

import database from '../../database';
import evaluation, { Evaluation, EvaluationUpdate } from './evaluation';
import { encrypt, decrypt } from './encryption';

const evaluationsCollection: any = database.collection('evaluations');

evaluationsCollection.ensureIndex({ 'user.id': 1 }, { background: true });

export default {
  addEvaluation(newEvaluation: Evaluation) {
    return evaluationsCollection.insertOne(encrypt(newEvaluation.dataModel()))
      .then(({ insertedId }) => evaluationsCollection.findOne({ _id: new ObjectID(insertedId) }))
      .then(res => (res ? evaluation(decrypt(res)) : null));
  },
  getEvaluationById(id: string): Promise<Evaluation> {
    return evaluationsCollection.findOne({ _id: new ObjectID(id) })
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
      { _id: new ObjectID(updatedEvaluation.id) },
      { $set: encrypt(updatedEvaluation) })
      .then(() => evaluationsCollection.findOne({ _id: new ObjectID(updatedEvaluation.id) }))
      .then(res => (res ? evaluation(decrypt(res)) : null));
  },
  get(userId: string, status: string) {
    const query = {}; // TODO: Work out a cleaner way to do this.
    if (userId) {
      query['user.id'] = userId;
    }

    if (status) {
      query['status'] = status;
    }

    return evaluationsCollection.find(query)
      .then(res => res.toArray())
      .then(res => res.map(e => evaluation(decrypt(e))));
  },
};
