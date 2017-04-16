const { ObjectId } = require('mongodb');
const R = require('ramda');

const usersData = require('../fixtures/users');
const database = require('../../backend/database');
const { encrypt, decrypt } = require('../../backend/models/evaluations/encryption');

const users = database.collection('users');
const templates = database.collection('templates');
const skills = database.collection('skills');
const evaluations = database.collection('evaluations');
const actions = database.collection('actions');

const prepopulateUsers = () => users.remove({}).then(() => users.insertMany(usersData));

module.exports = {
  prepopulateUsers,
  users,
  assignMentor: (userId, mentorId) => users.update({ _id: ObjectId(userId) }, { $set: { mentorId: String(mentorId) } }),
  templates,
  insertTemplate: (template) => templates.insertOne(Object.assign({}, template)),
  assignTemplate: (userId, templateId) => users.update({ _id: ObjectId(userId) }, { $set: { templateId: String(templateId) } }),
  skills,
  insertSkill: (skill) => skills.insertOne(Object.assign({}, skill)),
  evaluations,
  insertEvaluation: (evaluation, userId) => evaluations.insertOne(encrypt(Object.assign({}, evaluation, { user: { id: String(userId) } }))),
  getEvaluation: (evaluationId) => evaluations.findOne({ _id: ObjectId(evaluationId) }).then(decrypt),
  getEvaluations: () => evaluations.find({}).then((e) => e.toArray()).then(R.map(decrypt)),
  getAllActions: () => actions.find({}).then((e) => e.toArray()),
  insertAction: (userId) => (action) => actions.insertOne(Object.assign({}, action, { user: { id: String(userId) } })),
  clearDb: () => Promise.all([users.remove({}), templates.remove({}), skills.remove({}), evaluations.remove({}), actions.remove({})])
};
