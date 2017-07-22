import R from 'ramda';

import database from '../../database';
import template, { newTemplate } from './template';
import skills from './skills';
import skill, { newSkill } from './skill';

const templatesCollection = database.collection('templates');
const skillsCollection = database.collection('skills');

skillsCollection.ensureIndex({ id: 1 }, { unique: true, background: true });
templatesCollection.ensureIndex({ id: 1 }, { unique: true, background: true });

export default {
  templates: {
    addTemplate({ id, name, skillGroups, categories, levels }) {
      const aTemplate = newTemplate(id, name, skillGroups, levels, categories);
      return templatesCollection.updateOne({ id }, { $set: aTemplate }, { upsert: true })
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
      const aSkill = newSkill(id, name, type, version, criteria, questions);
      return skillsCollection.updateOne({ id }, { $set: aSkill }, { upsert: true })
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
