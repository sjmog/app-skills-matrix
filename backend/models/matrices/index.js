const database = require('../../database');
const templatesCollection = database.collection('templates');
const skillsCollection = database.collection('skills');
const template = require('./template');
const { ObjectId } = require('mongodb');

module.exports = {
  templates: {
    addTemplate: function (newTemplate) {
      return templatesCollection.insertOne(newTemplate)
        .then(({ insertedId }) => templatesCollection.findOne({ _id: new ObjectId(insertedId) }))
    },
    getById: function (id) {
      return templatesCollection.findOne({ id })
        .then((res) => res ? template(res) : null);
    },
    getAll: function () {
      return templatesCollection.find()
        .then((results) => results.toArray())
        .then((results) => results.map((doc) => template(doc)));
    }
  },
  skills: {
    addSkill: function (skill) {
      return skillsCollection.insertOne(skill)
        .then(({ insertedId }) => skillsCollection.findOne({ _id: new ObjectId(insertedId) }))
    }
  }
};
