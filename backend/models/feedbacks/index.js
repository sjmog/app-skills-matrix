const { ObjectId } = require('mongodb');

const database = require('../../database');
const feedback = require('./feedback');

const collection = database.collection('feedback');

collection.ensureIndex({ 'evaluation.id': 1 }, { background: true });
collection.ensureIndex({ 'user.id': 1 }, { background: true });

module.exports = {
  addFeedback: ({ user, evaluation, skill }) => {
    const changes = feedback.newFeedback(user, skill, evaluation);
    return collection.insertOne(changes)
      .then(({ insertedId }) => collection.findOne({ _id: new ObjectId(insertedId) }))
      .then(retrievedFeedback => feedback(retrievedFeedback))
  }
};
