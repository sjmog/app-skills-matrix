const R = require('ramda');

const database = require('../../database');

const templatesCollection = database.collection('templates');
const skillsCollection = database.collection('skills');
const template = require('./template');
const skills = require('./skills');
const skill = require('./skill');

skillsCollection.ensureIndex({ id: 1 }, { unique: true, background: true });
templatesCollection.ensureIndex({ id: 1 }, { unique: true, background: true });

module.exports = {
  templates: {
    addTemplate({ id, name, skillGroups, categories, levels }) {
      const newTemplate = template.newTemplate(id, name, skillGroups, levels, categories);
      return templatesCollection.updateOne({ id }, { $set: newTemplate }, { upsert: true })
        .then(() => templatesCollection.findOne({ id }))
        .then(retrievedTemplate => template(retrievedTemplate));
    },
    getById(id) {
      return templatesCollection.findOne({ id })
        .then(res => (res ? template(res) : null));
    },
    getAll() {
      return templatesCollection.find()
        .then(results => results.toArray())
        .then(results => results.map(doc => template(doc)));
    },
    updateTemplate(original, updates) {
      return templatesCollection.updateOne({ id: original.id }, { $set: R.omit('_.id', updates) })
        .then(() => templatesCollection.findOne({ id: original.id }))
        .then(updatedTemplate => template(updatedTemplate));
    },
  },
  skills: {
    addSkill({ id, name, type, version, criteria, questions }) {
      const newSkill = skill.newSkill(id, name, type, version, criteria, questions);
      return skillsCollection.updateOne({ id }, { $set: newSkill }, { upsert: true })
        .then(() => skillsCollection.findOne({ id }))
        .then(retrievedSkill => skill(retrievedSkill));
    },
    getById(id) {
      return skillsCollection.findOne({ id })
        .then(res => (res ? skill(res) : null));
    },
    updateSkill(original, updates) {
      return skillsCollection.updateOne({ id: original.id }, { $set: R.omit('_.id', updates) })
        .then(() => skillsCollection.findOne({ id: original.id }))
        .then(updatedSkill => skill(updatedSkill));
    },
    getAll() {
      return skillsCollection.find()
        .then(results => results.toArray())
        .then(results => skills(results));
    },
  },
};
