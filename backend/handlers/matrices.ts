import * as Promise from 'bluebird';
import * as R from 'ramda';

import matrices from '../models/matrices/index';
import createHandler from './createHandler';
import { TEMPLATE_NOT_FOUND } from './errors';
import { UnhydratedSkill } from '../models/evaluations/skill';

const { templates, skills } = matrices;

const handlerFunctions = Object.freeze({
  templates: {
    save: (req, res, next) => {
      Promise.try(() => JSON.parse(req.body.template))
        .then(template =>
          templates.getById(template.id)
            .then(retrievedTemplate =>
              (retrievedTemplate
                ? templates.updateTemplate(retrievedTemplate, template)
                : templates.addTemplate(template)))
            .then(t => res.status(201).json(t.viewModel())))
        .catch(next);
    },
    retrieve: (req, res, next) => {
      Promise.try(() => templates.getById(req.params.templateId))
        .then((template) => {
          if (!template) {
            return res.status(404).json(TEMPLATE_NOT_FOUND());
          }
          return res.status(200).json(template.normalizedViewModel());
        })
        .catch(next);
    },
  },
  skills: {
    save: (req, res, next) => {
      Promise.try(() => JSON.parse(req.body.skill))
        .then((newSkills: UnhydratedSkill[]) =>
          Promise.map([].concat(newSkills),
            skill => skills.getById(skill.id)
              .then(retrievedSkill =>
                (retrievedSkill
                  ? skills.updateSkill(retrievedSkill, skill)
                  : skills.addSkill(skill))))
            .then(changedSkills => res.status(201).json(R.map(s => s.viewModel(), changedSkills))))
        .catch(next);
    },
    getAll: (req, res, next) =>
      Promise.try(() => skills.getAll())
        .then(allSkills => res.status(200).json(allSkills.viewModel()))
        .catch(next),
  },
});

export default createHandler(handlerFunctions);
