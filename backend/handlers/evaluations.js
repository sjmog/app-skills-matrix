const Promise = require('bluebird');
const R = require('ramda');

const createHandler = require('./createHandler');

const { getEvaluationById, updateEvaluation, importEvaluation } = require('../models/evaluations');
const { templates } = require('../models/matrices');
const { getUserById, getUserByUsername } = require('../models/users');
const actions = require('../models/actions');

const { sendMail } = require('../services/email');

const {
  EVALUATION_NOT_FOUND,
  SKILL_NOT_FOUND,
  MUST_BE_SUBJECT_OF_EVALUATION_OR_MENTOR,
  MUST_BE_LOGGED_IN,
  SUBJECT_CAN_ONLY_UPDATE_NEW_EVALUATION,
  MENTOR_REVIEW_COMPLETE,
  MENTOR_CAN_ONLY_UPDATE_AFTER_SELF_EVALUATION,
  USER_NOT_FOUND,
  TEMPLATE_NOT_FOUND,
} = require('./errors');


const addActions = (user, skill, evaluation, newStatus) => {
  const actionToAdd = skill.addAction(newStatus);
  const actionToRemove = skill.removeAction(newStatus);
  const fns = [];
  if (actionToAdd) {
    fns.push(actions.addAction(actionToAdd, user, skill, evaluation));
  }
  if (actionToRemove) {
    fns.push(actions.removeAction(actionToRemove, user.id, skill.id, evaluation.id));
  }
  return Promise.all(fns);
};

const handlerFunctions = Object.freeze({
  evaluations: {
    import: (req, res, next) => {
      const { evaluation, username, template } = req.body;
      Promise.all([getUserByUsername(username), templates.getById(template)])
        .then(([user, template]) => {
          if (!user) {
            return res.status(404).json(USER_NOT_FOUND());
          }
          if (!template) {
            return res.status(404).json(TEMPLATE_NOT_FOUND());
          }

          evaluation.user = user.evaluationData;
          evaluation.template = template.evaluationData;

          if (template === 'eng-nodejs') {
            // have to map drupal skills to node skills :-(
            const badSkill = R.find((skill) => skill.id === 32, evaluation.skills);
            badSkill.id = 249;
            const badSkillGroup = R.find((skillGroup) => skillGroup.category === 'Technical Skill' && skillGroup.level === 'Experienced Beginner');
            badSkillGroup.skills = [259].concat(R.filter((skillId) => skillId !== 32, badSkillGroup.skills));
          }

          return importEvaluation(evaluation)
            .then(() => {
              return res.status(204).send();
            });
        })
        .catch(next);
    },
  },
  evaluation: {
    retrieve: (req, res, next) => {
      const { evaluationId } = req.params;
      const { user } = res.locals;

      Promise.try(() => getEvaluationById(evaluationId))
        .then(evaluation => {
          if (!evaluation) {
            return res.status(404).json(EVALUATION_NOT_FOUND());
          }

          if (!user) {
            return res.status(401).json(MUST_BE_LOGGED_IN());
          }

          if (user.id === evaluation.user.id) {
            return res.status(200).json(evaluation.subjectEvaluationViewModel);
          }

          return getUserById(evaluation.user.id)
            .then(({ mentorId }) => {
              if (user.id === mentorId) {
                return res.status(200).json(evaluation.mentorEvaluationViewModel)
              }

              if (user.isAdmin) {
                return res.status(200).json(evaluation.adminEvaluationViewModel)
              }

              return res.status(403).json(MUST_BE_SUBJECT_OF_EVALUATION_OR_MENTOR())
            })
        })
        .catch(next);
    },
    subjectUpdateSkillStatus: (req, res, next) => {
      const { evaluationId } = req.params;
      const { skillId, status } = req.body;
      const { user } = res.locals;

      getEvaluationById(evaluationId)
        .then((evaluation) => {
          if (!evaluation) {
            return res.status(404).json(EVALUATION_NOT_FOUND());
          }

          if (!user) {
            return res.status(401).json(MUST_BE_LOGGED_IN());
          }

          if (user.id !== evaluation.user.id) {
            return res.status(403).json(MUST_BE_SUBJECT_OF_EVALUATION_OR_MENTOR());
          }

          const skill = evaluation.findSkill(skillId);
          if (!skill) {
            return res.status(400).json(SKILL_NOT_FOUND());
          }

          return evaluation.isNewEvaluation()
            ? updateEvaluation(evaluation.updateSkill(skillId, status))
              .then(() => addActions(user, skill, evaluation, status))
              .then(() => res.sendStatus(204))
            : res.status(403).json(SUBJECT_CAN_ONLY_UPDATE_NEW_EVALUATION());
        })
        .catch(next)
    },
    mentorUpdateSkillStatus: (req, res, next) => {
      const { evaluationId } = req.params;
      const { skillId, status } = req.body;
      const { user } = res.locals;

      Promise.try(() => getEvaluationById(evaluationId))
        .then((evaluation) => {
          if (!evaluation) {
            return res.status(404).json(EVALUATION_NOT_FOUND());
          }

          if (!user) {
            return res.status(401).json(MUST_BE_LOGGED_IN());
          }

          const skill = evaluation.findSkill(skillId);
          if (!skill) {
            return res.status(400).json(SKILL_NOT_FOUND());
          }

          return getUserById(evaluation.user.id)
            .then((evalUser) => {
              if (user.id !== evalUser.mentorId) {
                return res.status(403).json(MUST_BE_SUBJECT_OF_EVALUATION_OR_MENTOR());
              }

              return evaluation.selfEvaluationCompleted()
                ? updateEvaluation(evaluation.updateSkill(skillId, status))
                  .then(addActions(evalUser, skill, evaluation, status))
                  .then(() => res.sendStatus(204))
                : res.status(403).json(MENTOR_CAN_ONLY_UPDATE_AFTER_SELF_EVALUATION());
            })
        })
        .catch(next)
    },
    complete: (req, res, next) => {
      const { evaluationId } = req.params;
      const { user } = res.locals;

      Promise.try(() => getEvaluationById(evaluationId))
        .then((evaluation) => {
          if (!evaluation) {
            return res.status(404).json(EVALUATION_NOT_FOUND());
          }

          if (!user) {
            return res.status(401).json(MUST_BE_LOGGED_IN());
          }

          if (evaluation.mentorReviewCompleted()) {
            return res.status(403).json(MENTOR_REVIEW_COMPLETE())
          }

          return getUserById(evaluation.user.id)
            .then(({ mentorId }) => {

              if (user.id === evaluation.user.id) {
                const completedApplication = evaluation.selfEvaluationComplete();
                return evaluation.isNewEvaluation()
                  ? Promise.all([updateEvaluation(completedApplication), getUserById(mentorId)])
                    .then(([updatedEvaluation, mentor]) => {
                      sendMail(updatedEvaluation.getSelfEvaluationCompleteEmail(mentor));
                      res.status(200).json({ status: updatedEvaluation.status })
                    })
                  : res.status(403).json(SUBJECT_CAN_ONLY_UPDATE_NEW_EVALUATION());
              }

              if (user.id !== mentorId) {
                return res.status(403).json(MUST_BE_SUBJECT_OF_EVALUATION_OR_MENTOR());
              }

              return evaluation.selfEvaluationCompleted()
                ? updateEvaluation(evaluation.mentorReviewComplete())
                  .then((updatedEvaluation) => res.status(200).json({ status: updatedEvaluation.status }))
                : res.status(403).json(MENTOR_CAN_ONLY_UPDATE_AFTER_SELF_EVALUATION())
            });
        })
        .catch(next);
    }
  }
});

module.exports = createHandler(handlerFunctions);
