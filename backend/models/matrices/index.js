const database = require('../../database');
const templatesCollection = database.collection('templates');
const skillsCollection = database.collection('skills');
const { ObjectId } = require('mongodb');

module.exports = {
  templates: {
    addTemplate: function(template) {
      return templatesCollection.insertOne(template)
        .then(({ insertedId }) => templatesCollection.findOne({ _id: new ObjectId(insertedId) }))
    },
    getById: function (templateId) {
      return templatesCollection.findOne({ templateId });
    }
  },
  skills: {
    addSkill: function(skill) {
      return skillsCollection.insertOne(skill)
        .then(({ insertedId }) => skillsCollection.findOne({ _id: new ObjectId(insertedId) }))
    }
  }
};
