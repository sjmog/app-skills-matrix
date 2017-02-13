const { templates, skills } = require('../models/matrices');
const createHandler = require('./createHandler');
const Promise = require('bluebird');

const handlerFunctions = Object.freeze({
  templates: {
    create: function (req, res, next) {
      Promise.try(() => JSON.parse(req.body.template))
        .then(templates.addTemplate)
        .then((newTemplateName) => res.status(201).send(newTemplateName))
        .catch(next);

      }
  },
  skills: {
    create: function (req, res, next) {
      Promise.try(() => JSON.parse(req.body.skill))
        .then(skills.addSkill)
        .then((newSkillName) => res.status(201).send(newSkillName))
        .catch(next);

    }
  }
});

module.exports = createHandler(handlerFunctions);
