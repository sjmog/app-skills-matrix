const { templates, skills  } = require('../models/matrices');
const createHandler = require('./createHandler');
const Promise = require('bluebird');

const handlerFunctions = Object.freeze({
  templates: {
    save: function (req, res, next) {
      Promise.try(() => JSON.parse(req.body.template))
        .then((template) =>
          templates.getTemplateByTemplateId(template.templateId)
            .then(retrievedTemplate =>
              (retrievedTemplate
                ? templates.updateTemplate(retrievedTemplate, template)
                : templates.addTemplate(template)))
            .then(template => res.status(201).send(template)))
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
