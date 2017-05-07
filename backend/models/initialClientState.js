const R = require('ramda');
const Promise = require('bluebird');
const moment = require('moment');

const users = require('./users');
const { templates } = require('./matrices');
const evaluations = require('./evaluations');
const { VIEW } = require('./evaluations/evaluation');

const sortNewestToOldest = evaluations => evaluations.sort((a, b) => moment(a.createdDate).isBefore(b.createdDate));

const getViewModel = (evaluation, view) => {
  switch (view) {
    case VIEW.ADMIN:
      return evaluation.adminMetadataViewModel;
    case VIEW.MENTOR:
      return evaluation.mentorMetadataViewModel;
    case VIEW.SUBJECT:
      return evaluation.subjectMetadataViewModel;
  }
};

const getEvaluations = (id, view) =>
  evaluations.getByUserId(id)
    .then(sortNewestToOldest)
    .then((sortedEvaluations) =>
      sortedEvaluations.map((evaluation) => getViewModel(evaluation, view)));

const getMenteeEvaluations = (id) =>
  Promise.map(
    users.getByMentorId(id),
    ({ id, name, username }) =>
      getEvaluations(id, VIEW.MENTOR)
        .then(evaluations => ({ name: name || username, evaluations }))
  );

const augmentWithEvaluations = (users, view) =>
  Promise.map(
    users,
    (user) =>
      getEvaluations(user.id, view)
        .then((evaluations) => Object.assign({}, user.manageUserViewModel, { evaluations }))
  );

const adminClientState = () => {
  return Promise.all([users.getAll(), templates.getAll()])
    .then(([allUsers = [], allTemplates = []]) =>
      augmentWithEvaluations(allUsers, VIEW.ADMIN)
        .then((users) => ({
            users: {
              users,
              newEvaluations: []
            },
            matrices: {
              templates: R.map((domainTemplate) => domainTemplate.viewModel, allTemplates),
            },
          })
        ));
};

const clientState = (user) =>
  user ?
    Promise.all([
        users.getUserById(user.mentorId),
        templates.getById(user.templateId),
        getEvaluations(user.id, VIEW.SUBJECT),
        getMenteeEvaluations(user.id)
      ])
      .then(([mentor, template, evaluations, menteeEvaluations]) =>
        ({
          user: {
            userDetails: user ? user.userDetailsViewModel : null,
            mentorDetails: mentor ? mentor.userDetailsViewModel : null,
            template: template ? template.viewModel : null,
            evaluations,
            menteeEvaluations,
          }
        }))
    :
    Promise.resolve({ user: {} });

module.exports = {
  adminClientState,
  clientState,
};
