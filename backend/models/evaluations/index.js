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
};
