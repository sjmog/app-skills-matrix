import * as R from 'ramda';
import * as Promise from 'bluebird';
import * as moment from 'moment';

import userCollection from './users/index';
import { User } from './users/user';
import matrices from './matrices/index';
import evaluationCollection from './evaluations/index';

const sortNewestToOldest = evaluations => evaluations.sort((a, b) => moment(a.createdDate).isBefore(b.createdDate));
const { templates } = matrices;

const getEvaluations = id =>
  evaluationCollection.getByUserId(id)
    .then(sortNewestToOldest);

const getSubjectEvaluations = id =>
  getEvaluations(id)
    .then(evaluations => evaluations.map(evaluation => evaluation.subjectMetadataViewModel()));

const getMenteeEvaluations = mentorId =>
  Promise.map(
    userCollection.getByMentorId(mentorId),
    ({ id, name, username }) =>
      getEvaluations(id)
        .then(evaluations => evaluations.map(evaluation => evaluation.mentorMetadataViewModel()))
        .then(evaluations => ({ name: name || username, evaluations })));


const augmentWithEvaluations = (users): Promise<UserWithEvaluations[]> =>
  Promise.map(
    users,
    (user: User) =>
      getEvaluations(user.id)
        .then(evaluations => evaluations.map(evaluation => evaluation.adminMetadataViewModel()))
        .then(evaluations => Object.assign({}, user.manageUserViewModel(), { evaluations })));

export const adminClientState = (): Promise<AdminClientState> =>
  Promise.all([userCollection.getAll(), templates.getAll()])
    .then(([allUsers = [], allTemplates = []]) =>
      augmentWithEvaluations(allUsers)
        .then(users => (
          {
            users: {
              users,
              newEvaluations: [],
            },
            matrices: {
              templates: R.map(domainTemplate => domainTemplate.viewModel(), allTemplates),
            },
          })));

export const clientState = (user: User): Promise<ClientState> =>
  (user ? Promise.all([
      userCollection.getUserById(user.mentorId),
      templates.getById(user.templateId),
      getSubjectEvaluations(user.id),
      getMenteeEvaluations(user.id),
    ]).then(([mentor, template, evaluations, menteeEvaluations]) =>
      ({
        entities: {
          users: {
            entities: {
              [user.id]: user.userDetailsViewModel(),
            },
          },
        }, // TODO: Add test for this
        user: {
          userDetails: user ? user.userDetailsViewModel() : null,
          mentorDetails: mentor ? mentor.userDetailsViewModel() : null,
          template: template ? template.viewModel() : null,
          evaluations,
          menteeEvaluations,
        },
      }))
    : Promise.resolve({ user: {} }));
