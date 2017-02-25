const { templates, skills  } = require('../models/matrices');
const createHandler = require('./createHandler');
const Promise = require('bluebird');

const handlerFunctions = Object.freeze({
  templates: {
    save: function (req, res, next) {
      Promise.try(() => JSON.parse(req.body.template))
        .then((template) =>
          templates.getById(template.id)
            .then(retrievedTemplate =>
              (retrievedTemplate
                ? templates.updateTemplate(retrievedTemplate, template)
                : templates.addTemplate(template)))
            .then(template => res.status(201).json(template.viewModel)))
        .catch(next);

    }
  },
  skills: {
    save: function (req, res, next) {
      Promise.try(() => JSON.parse(req.body.skill))
        .then((skill) =>
          skills.getById(skill.id)
            .then(retrievedSkill =>
              (retrievedSkill
                ? skills.updateSkill(retrievedSkill, skill)
                : skills.addSkill(skill)))
            .then(skill => res.status(201).send(skill)))
        .catch(next);
    }
  }
});

module.exports = createHandler(handlerFunctions);
