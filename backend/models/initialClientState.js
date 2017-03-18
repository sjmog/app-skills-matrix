const R = require('ramda');
const Promise = require('bluebird');

const users = require('./users');
const { templates } = require('./matrices');
const evaluations = require('./evaluations');

const viewModels = R.map((domainEvaluation, viewModel = 'viewModel') => domainEvaluation[viewModel]);

const getMenteeEvaluations = (id) => Promise.reduce(
  users.getByMentorId(id),
  (menteeEvaluations, user) =>
    evaluations.getByUserId(user.id)
      .then(viewModels)
      .then((evaluations) => {
        menteeEvaluations[user.name] = evaluations;
        return menteeEvaluations
      }), {}
);

const adminClientState = () => {
  return Promise.all([users.getAll(), templates.getAll()])
    .then(([allUsers = [], allTemplates = []]) => ({
      users: {
        users: viewModels(allUsers, 'manageUserViewModel'),
        newEvaluations: [],
      },
      matrices: {
        templates: viewModels(allTemplates),
      },
    }));
};

const clientState = (user) =>
  user ?
    Promise.all([
        users.getUserById(user.mentorId),
        templates.getById(user.templateId),
        evaluations.getByUserId(user.id),
        getMenteeEvaluations(user.id)
      ])
      .then(([mentor, template, evaluations, menteeEvaluations]) =>
        ({
          dashboard: {
            user: user ? user.userDetailsViewModel : null,
            mentor: mentor ? mentor.userDetailsViewModel : null,
            template: template ? template.viewModel : null,
            evaluations: viewModels(evaluations),
            menteeEvaluations: R.isEmpty(menteeEvaluations) ? null : menteeEvaluations,
          }
        }))
    :
    Promise.resolve({ dashboard: {} });

module.exports = {
  adminClientState,
  clientState,
};
