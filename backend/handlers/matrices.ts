import * as Promise from 'bluebird';
import * as R from 'ramda';

import matrices from '../models/matrices/index';
import createHandler from './createHandler';
import { INVALID_LEVEL_OR_CATEGORY, TEMPLATE_NOT_FOUND } from './errors';
import { Skill } from '../models/matrices/skill';

const { templates, skills } = matrices;

const handlerFunctions = Object.freeze({
    templates: {
      save: (req, res, next) => {
        // TODO - validation eh?
        const template = req.body.template;
        Promise.try(() => templates.getById(template.id))
          .then(retrievedTemplate =>
            (retrievedTemplate
              ? templates.updateTemplate(retrievedTemplate, template)
              : templates.addTemplate(template)))
          .then(t => res.status(201).json(t.viewModel()))
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
      addSkill: (req, res, next) => {
        Promise.try(() => templates.getById(req.params.templateId))
          .then((template) => {
            if (!template) {
              return res.status(404).json(TEMPLATE_NOT_FOUND());
            }
            const { level, category } = req.body;
            if (!template.hasLevel(level) || !template.hasCategory(category)) {
              return res.status(400).json(INVALID_LEVEL_OR_CATEGORY(level, category, template.id));
            }

            return (!!req.body.existingSkillId ? Promise.resolve({ id: req.body.existingSkillId }) : skills.addNewSkill())
              .then(({ id }) => {
                const changes = template.addSkill(level, category, id);
                return Promise.all([templates.updateTemplate(template, changes), skills.getAll()]);
              }).then(([t, skills]) => res.status(200).json({
                template: t.normalizedViewModel(),
                skills: skills.viewModel(),
              }));
          }).catch(next);
      },
      replaceSkill: (req, res, next) => {
        Promise.try(() => templates.getById(req.params.templateId))
          .then((template) => {
            if (!template) {
              return res.status(404).json(TEMPLATE_NOT_FOUND());
            }
            const { level, category } = req.body;
            if (!template.hasLevel(level) || !template.hasCategory(category)) {
              return res.status(400).json(INVALID_LEVEL_OR_CATEGORY(level, category, template.id));
            }
            return skills.addNewSkill(req.body.skill)
              .then((newSkill) => {
                const changes = template.replaceSkill(level, category, req.body.skill.id, newSkill.id);
                return Promise.all([templates.updateTemplate(template, changes), skills.getAll()]);
              }).then(([t, skills]) => res.status(200).json({
                template: t.normalizedViewModel(),
                skills: skills.viewModel(),
              }));
          })
          .catch(next);
      },
      removeSkill: (req, res, next) => {
        Promise.try(() => templates.getById(req.params.templateId))
          .then((template) => {
            if (!template) {
              return res.status(404).json(TEMPLATE_NOT_FOUND());
            }
            const { level, category } = req.body;
            if (!template.hasLevel(level) || !template.hasCategory(category)) {
              return res.status(400).json(INVALID_LEVEL_OR_CATEGORY(level, category, template.id));
            }
            const changes = template.removeSkill(level, category, req.body.skillId);
            return Promise.all([templates.updateTemplate(template, changes), skills.getAll()])
              .then(([t, skills]) => res.status(200).json({
                template: t.normalizedViewModel(),
                skills: skills.viewModel(),
              }));
          })
          .catch(next);
      },
    },
    skills:
      {
        save: (req, res, next) => {
          Promise.map<UnhydratedTemplateSkill, Skill>(req.body.skills,
            skill => skills.getById(skill.id)
              .then(retrievedSkill =>
                (retrievedSkill
                  ? skills.updateSkill(retrievedSkill, skill)
                  : skills.addSkill(skill))))
            .then(changedSkills => res.status(201).json(R.map(s => s.data(), changedSkills)))
            .catch(next);
        },
        getAll:
          (req, res, next) =>
            Promise.try(() => skills.getAll())
              .then(allSkills => res.status(200).json(allSkills.viewModel()))
              .catch(next),
      }
    ,
  })
;

export default createHandler(handlerFunctions);
