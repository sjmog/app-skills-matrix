import * as R from 'ramda';

import database from '../../database';
import template, { newTemplate, Template } from './template';
import skills from './skills';
import skill, { newSkill, Skill } from './skill';

const templatesCollection = database.collection('templates');
const skillsCollection = database.collection('skills');

skillsCollection.ensureIndex({ id: 1 }, { unique: true, background: true });
templatesCollection.ensureIndex({ id: 1 }, { unique: true, background: true });

export default {
  templates: {
    addTemplate({ id, name, skillGroups, categories, levels }): Promise<Template> {
      const aTemplate = newTemplate(id, name, skillGroups, levels, categories);
      return templatesCollection.updateOne({ id }, { $set: aTemplate }, { upsert: true })
        .then(() => templatesCollection.findOne({ id }))
        .then(retrievedTemplate => template(retrievedTemplate));
    },
    getById(id): Promise<Template> {
      return templatesCollection.findOne({ id })
        .then(res => (res ? template(res) : null));
    },
    getAll(): Promise<Template[]> {
      return templatesCollection.find()
        .then(results => results.toArray())
        .then(results => results.map(doc => template(doc)));
    },
    updateTemplate(original, updates): Promise<Template> {
      return templatesCollection.updateOne({ id: original.id }, { $set: R.omit(['_.id'], updates) })
        .then(() => templatesCollection.findOne({ id: original.id }))
        .then(updatedTemplate => template(updatedTemplate));
    },
  },
  skills: {
    addSkill({ id, name, type, version, criteria, questions }): Promise<Skill> {
      const aSkill = newSkill(id, name, type, version, criteria, questions);
      return skillsCollection.updateOne({ id }, { $set: aSkill }, { upsert: true })
        .then(() => skillsCollection.findOne({ id }))
        .then(retrievedSkill => skill(retrievedSkill));
    },
    getById(id): Promise<Skill> {
      return skillsCollection.findOne({ id })
        .then(res => (res ? skill(res) : null));
    },
    updateSkill(original, updates): Promise<Skill> {
      return skillsCollection.updateOne({ id: original.id }, { $set: R.omit(['_.id'], updates) })
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
