const { ObjectId } = require('mongodb');

const database = require('../../database');
const templatesCollection = database.collection('templates');
const skillsCollection = database.collection('skills');
const template = require('./template');
const skill = require('./skill');

module.exports = {
  templates: {
    addTemplate: function ({ templateId, name, skillGroups }) {
      const changes = template.newTemplate(templateId, name, skillGroups);
      return templatesCollection.updateOne({ templateId }, { $set: changes }, { upsert: true })
        .then(() => templatesCollection.findOne({ templateId }))
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
    getTemplateByTemplateId: function (templateId) {
      return templatesCollection.findOne({ templateId })
        .then(res => res ? template(res) : null);
    },
    updateTemplate: function (original, updates) {
      return templatesCollection.updateOne({ _id: original.id }, { $set: updates })
        .then(() => templatesCollection.findOne({ _id: original.id }))
        .then(updatedTemplate => template(updatedTemplate))
    },
  },
  skills: {
    addSkill: function ({ skillId, name, acceptanceCriteria, questions }) {
      const changes = skill.newSkill(skillId, name, acceptanceCriteria, questions);
      return skillsCollection.updateOne({ skillId }, { $set: changes }, { upsert: true })
        .then(() => skillsCollection.findOne({ skillId }))
        .then(retrievedSkill => skill(retrievedSkill))
    },
    getSkillBySkillId: function (skillId) {
      return skillsCollection.findOne({ skillId })
        .then(res => res ? skill(res) : null);
    },
    updateSkill: function (original, updates) {
      return skillsCollection.updateOne({ _id: original.id }, { $set: updates })
        .then(() => skillsCollection.findOne({ _id: original.id }))
        .then(updatedSkill => skill(updatedSkill))
    },
  }
};
