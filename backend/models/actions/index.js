const { ObjectId } = require('mongodb');
const keymirror = require('keymirror');

const database = require('../../database');
const action = require('./action');

const collection = database.collection('actions');

collection.ensureIndex({ 'evaluation.id': 1 }, { background: true });
collection.ensureIndex({ 'user.id': 1 }, { background: true });

const ACTION_TYPE = keymirror({
  FEEDBACK: null,
  OBJECTIVE: null,
});

module.exports = {
  addFeedback: ({ user, evaluation, skill }) => {
    const changes = action.newAction(ACTION_TYPE.FEEDBACK, user, skill, evaluation);
    return collection.insertOne(changes)
      .then(({ insertedId }) => collection.findOne({ _id: new ObjectId(insertedId) }))
      .then(retrievedAction => action(retrievedAction))
  },
};
