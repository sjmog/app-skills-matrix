const R = require('ramda');
const Promise = require('bluebird');
const moment = require('moment');

const users = require('./users');
const { templates } = require('./matrices');
const evaluations = require('./evaluations');

const sortNewestToOldest = evaluations => evaluations.sort((a, b) => moment(a.createdDate).isBefore(b.createdDate));

const getEvaluations = (id) =>
  evaluations.getByUserId(id)
    .then(sortNewestToOldest);

const getSubjectEvaluations = (id) =>
  getEvaluations(id)
    .then((evaluations) => evaluations.map((evaluation) => evaluation.subjectMetadataViewModel));

const getMenteeEvaluations = (id) =>
  Promise.map(
    users.getByMentorId(id),
    ({ id, name, username }) =>
      getEvaluations(id)
        .then((evaluations) => evaluations.map((evaluation) => evaluation.mentorMetadataViewModel))
        .then(evaluations => ({ name: name || username, evaluations }))
  );

const augmentWithEvaluations = (users) =>
  Promise.map(
    users,
    (user) =>
      getEvaluations(user.id)
        .then((evaluations) => evaluations.map((evaluation) => evaluation.adminMetadataViewModel))
        .then((evaluations) => Object.assign({}, user.manageUserViewModel, { evaluations }))
  );

const adminClientState = () => {
  return Promise.all([users.getAll(), templates.getAll()])
    .then(([allUsers = [], allTemplates = []]) =>
      augmentWithEvaluations(allUsers)
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
        getSubjectEvaluations(user.id),
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
