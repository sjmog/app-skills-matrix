const database = require('../../database');
const templatesCollection = database.collection('templates');
const skillsCollection = database.collection('skills');
const template = require('./template');
const skill = require('./skill');

module.exports = {
  templates: {
    addTemplate: function ({ id, name, skillGroups }) {
      const changes = template.newTemplate(id, name, skillGroups);
      return templatesCollection.updateOne({ id }, { $set: changes }, { upsert: true })
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
      return templatesCollection.updateOne({ _id: original.id }, { $set: updates })
        .then(() => templatesCollection.findOne({ _id: original.id }))
        .then(updatedTemplate => template(updatedTemplate))
    },
  },
  skills: {
    addSkill: function ({ id, name, acceptanceCriteria, questions }) {
      const changes = skill.newSkill(id, name, acceptanceCriteria, questions);
      return skillsCollection.updateOne({ id }, { $set: changes }, { upsert: true })
        .then(() => skillsCollection.findOne({ id }))
        .then(retrievedSkill => skill(retrievedSkill))
    },
    getById: function (id) {
      return skillsCollection.findOne({ id })
        .then(res => res ? skill(res) : null);
    },
    updateSkill: function (original, updates) {
      return skillsCollection.updateOne({ _id: original.id }, { $set: updates })
        .then(() => skillsCollection.findOne({ _id: original.id }))
        .then(updatedSkill => skill(updatedSkill))
    },
  }
};
