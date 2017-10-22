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

const getMentorViewModel = (userId, lineManagerId) =>
  evaluation =>
    (userId === lineManagerId
        ? evaluation.lineManagerAndMentorMetadataViewModel()
        : evaluation.mentorMetadataViewModel());

const getLineMangerViewModel = (userId, mentorId) =>
  evaluation =>
    (userId === mentorId
        ? evaluation.lineManagerAndMentorMetadataViewModel()
        : evaluation.lineManagerMetadataViewModel());

const getMenteeData = (userId: string)  =>
  userCollection.getByMentorId(userId)
    .then(mentees => Promise.reduce(
      mentees,
      (acc, mentee: User) => {
        const menteeId = R.prop('id', mentee) as string;
        const lineManagerId = R.prop('lineManagerId', mentee);

        return getEvaluations(menteeId)
          .then(R.map(getMentorViewModel(userId, lineManagerId)))
          .then((evaluations) => {
            const evaluationIds = R.map(R.prop('id'), evaluations) as string[];

            return {
              users: { ...acc.users, [menteeId]: mentee.userDetailsViewModel() },
              evaluations: [...acc.evaluations, ...evaluations],
            };
          });
      },
      { users: [], evaluations: [] }));

const getReportData = (userId: string)  =>
  userCollection.getByLineManagerId(userId)
    .then(mentees => Promise.reduce(
      mentees,
      (acc, report: User) => {
        const reportId = R.prop('id', report) as string;
        const mentorId = R.prop('mentorId', report);

        return getEvaluations(reportId)
          .then(R.map(getLineMangerViewModel(userId, mentorId)))
          .then((evaluations) => {
            const evaluationIds = R.map(R.prop('id'), evaluations) as string[];

            return {
              users: { ...acc.users, [reportId]: report.userDetailsViewModel() },
              evaluations: [...acc.evaluations, ...evaluations],
            };
          });
      },
      { users: [], evaluations: [] }));

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
      getMenteeData(user.id),
      getReportData(user.id),
    ])).then(([mentor, lineManager, template, evaluations, mentee, report]) => ({
      entities: {
        users: {
          entities: {
            [user.id]: user.userDetailsViewModel(),
            ...mentee.users,
            ...report.users,
          },
        },
        evaluations: {
          entities: arrayToKeyedObject([...evaluations, ...mentee.evaluations, ...report.evaluations]),
        },
      },
      user: {
        userDetails: user ? user.userDetailsViewModel() : null,
        mentorDetails: mentor ? mentor.userDetailsViewModel() : null,
        lineManagerDetails: lineManager ? lineManager.userDetailsViewModel() : null,
        template: template ? template.viewModel() : null,
        evaluations: R.map(R.prop('id'), evaluations),
        mentees: R.keys(mentee.users),
        reports: R.keys(report.users),
      },
    }))
    : Promise.resolve({ user: {} }));
