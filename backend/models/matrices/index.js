const database = require('../../database');
const templatesCollection = database.collection('templates');
const skillsCollection = database.collection('skills');
const template = require('./template');
const skills = require('./skills');
const skill = require('./skill');

module.exports = {
  templates: {
    addTemplate: function ({ id, name, skillGroups }) {
      const newTemplate = template.newTemplate(id, name, skillGroups);
      return templatesCollection.updateOne({ id }, { $set: newTemplate }, { upsert: true })
        .then(() => templatesCollection.findOne({ id }))
        .then(retrievedTemplate => template(retrievedTemplate))
    },
    getById: function (id) {
      return templatesCollection.findOne({ id })
        .then((res) => res ? template(res) : null);
    },
    getAll: function () {
      return templatesCollection.find()
        .then((results) => results.toArray())
        .then((results) => results.map((doc) => template(doc)));
    },
    updateTemplate: function (original, updates) {
      delete updates._id;
      return templatesCollection.updateOne({ id: original.id }, { $set: updates })
        .then(() => templatesCollection.findOne({ id: original.id }))
        .then(updatedTemplate => template(updatedTemplate))
    },
  },
  skills: {
    addSkill: function ({ id, name, acceptanceCriteria, questions }) {
      const newSkill = skill.newSkill(id, name, acceptanceCriteria, questions);
      return skillsCollection.updateOne({ id }, { $set: newSkill }, { upsert: true })
        .then(() => skillsCollection.findOne({ id }))
        .then(retrievedSkill => skill(retrievedSkill))
    },
    getById: function (id) {
      return skillsCollection.findOne({ id })
        .then(res => res ? skill(res) : null);
    },
    updateSkill: function (original, updates) {
      delete updates._id;
      return skillsCollection.updateOne({ id: original.id }, { $set: updates })
        .then(() => skillsCollection.findOne({ id: original.id }))
        .then(updatedSkill => skill(updatedSkill))
    },
    getAll: function () {
      return skillsCollection.find()
        .then((results) => results.toArray())
        .then((results) => skills(results));
    }
  }
};
