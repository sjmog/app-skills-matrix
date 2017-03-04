const R = require('ramda');
const Promise = require('bluebird');

const users = require('./users');
const { templates }= require('./matrices');
const evaluations = require('./evaluations');

const adminClientState = () => {
  return Promise.all([users.getAll(), templates.getAll()])
    .then(([allUsers = [], allTemplates = []]) => ({
      manageUsers: {
        users: R.map((domainUser) => domainUser.manageUserViewModel, allUsers),
        templates: R.map((domainTemplate) => domainTemplate.viewModel, allTemplates),
        newEvaluations: [],
      }
    }));
};

const clientState = (user) =>
  Promise.all([users.getUserById(user.mentorId), templates.getById(user.templateId), evaluations.getByUserId(user.id)])
    .then(([mentor, template, evaluations]) => ({
      dashboard: {
        user: user ? user.userDetailsViewModel : null,
        mentor: mentor ? mentor.userDetailsViewModel : null,
        template: template ? template.viewModel : null,
        evaluations: R.map((domainEvaluation) => domainEvaluation.viewModel, evaluations),
      }
      }));

module.exports = {
  adminClientState,
  clientState,
};
