import * as R from 'ramda';
import * as Promise from 'bluebird';
import * as moment from 'moment';

import userCollection from './users/index';
import { User } from './users/user';
import matrices from './matrices/index';
import evaluationCollection from './evaluations/index';

const arrayToKeyedObject = <T extends { id: string | number }>(arr: T[]) =>
  arr.reduce((acc, item) => Object.assign({}, acc, { [item.id]: item }), {});

const sortNewestToOldest = evaluations => evaluations.sort((a, b) => moment(a.createdDate).isBefore(b.createdDate));
const { templates } = matrices;

const getEvaluations = id =>
  evaluationCollection.getByUserId(id)
    .then(sortNewestToOldest);

const getSubjectEvaluations = id =>
  getEvaluations(id)
    .then(evaluations => evaluations.map(evaluation => evaluation.subjectMetadataViewModel()));

const getMenteeEvaluations = userId =>
  Promise.map(
    userCollection.getByMentorId(userId),
    ({ id, name, username, lineManagerId }) => getEvaluations(id)
      .then(evaluations =>
        evaluations.map(evaluation => (
          userId === lineManagerId
            ? evaluation.lineManagerAndMentorMetadataViewModel()
            : evaluation.mentorMetadataViewModel()))))
    .then(R.flatten);

const getReportsEvaluations = userId =>
  Promise.map(
    userCollection.getByLineManagerId(userId),
    ({ id, name, username, mentorId }) =>
      getEvaluations(id)
        .then(evaluations =>
          evaluations.map(evaluation => (
            userId === mentorId
              ? evaluation.lineManagerAndMentorMetadataViewModel()
              : evaluation.lineManagerMetadataViewModel()))))
    .then(R.flatten);

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
  (user ? (<any>Promise.all([ // <any> because the bluebird type definition only has 5 generics.  Are we doing too much?
      userCollection.getUserById(user.mentorId),
      userCollection.getUserById(user.lineManagerId),
      templates.getById(user.templateId),
      getSubjectEvaluations(user.id),
      getMenteeEvaluations(user.id),
      getReportsEvaluations(user.id),
    ])).then(([mentor, lineManager, template, evaluations, menteeEvaluations, reportsEvaluations]) => ({
      entities: {
        users: {
          entities: {
            [user.id]: user.userDetailsViewModel(),
          },
        },
        evaluations: {
          entities: arrayToKeyedObject([...evaluations, ...menteeEvaluations, ...reportsEvaluations]),
        },
      },
      user: {
        userDetails: user ? user.userDetailsViewModel() : null,
        mentorDetails: mentor ? mentor.userDetailsViewModel() : null,
        lineManagerDetails: lineManager ? lineManager.userDetailsViewModel() : null,
        template: template ? template.viewModel() : null,
        evaluations: R.map(R.prop('id'), evaluations),
        menteeEvaluations: R.map(R.prop('id'), menteeEvaluations),
        reportsEvaluations: R.map(R.prop('id'), reportsEvaluations),
      },
    }))
    : Promise.resolve({ user: {} }));
