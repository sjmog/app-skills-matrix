const R = require('ramda');
const Promise = require('bluebird');
const moment = require('moment');

const users = require('./users');
const { templates } = require('./matrices');
const evaluations = require('./evaluations');

const sortNewestToOldest = (evaluations) => evaluations.sort((a, b) => moment(a.createdDate).isBefore(b.createdDate));

const getEvaluations = (id, menteeEvaluations = false) =>
  evaluations.getByUserId(id)
    .then(sortNewestToOldest)
    .then((sortedEvaluations) =>
      R.map((evaluation) => (
        menteeEvaluations
          ? evaluation.mentorMetadataViewModel
          : evaluation.subjectMetadataViewModel),
        sortedEvaluations));

const getMenteeEvaluations = (id) =>
  Promise.map(
   users.getByMentorId(id),
    ({ id, name, username }) => {
      const menteeEvaluations = true;
      return getEvaluations(id, menteeEvaluations)
        .then(evaluations => ({ name: name || username , evaluations }))
    }
  );

const adminClientState = () => {
  return Promise.all([users.getAll(), templates.getAll()])
    .then(([allUsers = [], allTemplates = []]) => ({
      users: {
        users: R.map((domainUser) => domainUser.manageUserViewModel, allUsers),
        newEvaluations: [],
      },
      matrices: {
        templates: R.map((domainTemplate) => domainTemplate.viewModel, allTemplates),
      },
    }));
};

const clientState = (user) =>
  user ?
    Promise.all([
        users.getUserById(user.mentorId),
        templates.getById(user.templateId),
        getEvaluations(user.id),
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
