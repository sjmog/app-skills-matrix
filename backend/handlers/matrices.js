const { templates, skills } = require('../models/matrices');
const createHandler = require('./createHandler');

const handlerFunctions = Object.freeze({
  templates: {
    create: function (req, res, next) {
      templates.addTemplate(JSON.parse(req.body.template))
        .then((newTemplateName) => res.status(201).send(newTemplateName))
        .catch(next);

      }
  },
  skills: {
    create: function (req, res, next) {
      skills.addSkill(JSON.parse(req.body.skill))
        .then((newSkillName) => res.status(201).send(newSkillName))
        .catch(next);

    }
  }
});

module.exports = createHandler(handlerFunctions);
