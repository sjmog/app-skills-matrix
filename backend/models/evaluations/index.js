const database = require('../../database');
const evaluationsCollection = database.collection('evaluations');
const { ObjectId } = require('mongodb');

module.exports = {
  templates: {
    addEvaluation: function (newEvaluation) {
      return evaluationsCollection.insertOne(newEvaluation)
        .then(({ insertedId }) => evaluationsCollection.findOne({ _id: new ObjectId(insertedId) }))
    },
  }
};
