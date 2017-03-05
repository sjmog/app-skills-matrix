const database = require('../../database');
const evaluationsCollection = database.collection('evaluations');
const evaluation = require('./evaluation');
const { ObjectId } = require('mongodb');

module.exports = {
  addEvaluation: function (newEvaluation) {
    return evaluationsCollection.insertOne(newEvaluation)
      .then(({ insertedId }) => evaluationsCollection.findOne({ _id: new ObjectId(insertedId) }))
      .then((res) => res ? evaluation(res) : null);
  },
  getEvaluationById: function (id) {
    return evaluationsCollection.findOne({ _id: new ObjectId(id) })
      .then(res => res ? evaluation(res) : null);
  },
  getByUserId: function (userId) {
    return evaluationsCollection.find({ 'user.id': userId })
      .then(res => res.toArray())
      .then(res => res.map(evaluation))
  }
};
