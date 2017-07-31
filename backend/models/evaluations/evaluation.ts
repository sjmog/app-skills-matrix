import * as keymirror from 'keymirror';
import * as R from 'ramda';

import { DatabaseObject } from '../../database';
import { Email } from '../../services/email';
import { User } from '../users/user';
import skill, { Skill, UnhydratedSkill } from './skill';
import { Skill as TemplateSkill } from '../matrices/skill';
import { Template, SkillGroup } from '../matrices/template';
import { EvaluationMetadataViewModel } from '../../../types/evaluations';

const HOST = process.env.HOST;

export const STATUS = keymirror({
  NEW: null,
  SELF_EVALUATION_COMPLETE: null,
  MENTOR_REVIEW_COMPLETE: null,
});

const VIEW = keymirror({
  SUBJECT: null,
  MENTOR: null,
  ADMIN: null,
});

type EvaluationUser = { name: string, id: string, email: string };

type UnhydratedEvaluation = {
  user: EvaluationUser,
  createdDate: Date,
  template: { name: string },
  skillGroups: SkillGroup[],
  skills: UnhydratedSkill[],
  status: string,
};

type EvaluationViewModel = {
  id: string,
  subject: EvaluationUser,
  status: string,
  template: {},
  skillGroups: { [id: string]: SkillGroup },
  skills: { [id: string]: UnhydratedSkill },
  view: string,
};

export type EvaluationUpdate = {
  id: string;
  user: {},
  createdDate: Date,
  template: {},
  skillGroups: SkillGroup[],
  skills: UnhydratedSkill[],
  status: string,
};

export type EvaluationFeedback = {
  id: string,
  createdDate: Date,
};

export type Evaluation = {
  id: string | null,
  user: {},
  createdDate: Date,
  template: {},
  skillGroups: SkillGroup[],
  status: string,
  dataModel: () => UnhydratedEvaluation,
  subjectMetadataViewModel: () => EvaluationMetadataViewModel,
  mentorMetadataViewModel: () => EvaluationMetadataViewModel,
  adminMetadataViewModel: () => EvaluationMetadataViewModel,
  subjectEvaluationViewModel: () => EvaluationViewModel,
  mentorEvaluationViewModel: () => EvaluationViewModel,
  adminEvaluationViewModel: () => EvaluationViewModel,
  newEvaluationEmail: () => Email,
  feedbackData: () => EvaluationFeedback,
  getSelfEvaluationCompleteEmail: (user: User) => Email,
  findSkill: (skillId: string) => Skill | null,
  updateSkill: (skillId: string, status: string) => EvaluationUpdate,
  isNewEvaluation: () => boolean,
  selfEvaluationComplete: () => EvaluationUpdate,
  selfEvaluationCompleted: () => boolean,
  mentorReviewComplete: () => EvaluationUpdate,
  mentorReviewCompleted: () => boolean,
  mergePreviousEvaluation: (previousEvaluation: Evaluation) => Evaluation,
};

const arrayToKeyedObject = skills => skills.reduce((acc, item) => Object.assign({}, acc, { [item.id]: item }), {});

const evaluation = ({ _id, user, createdDate, template, skillGroups, status, skills }: DatabaseObject & UnhydratedEvaluation): Evaluation => {
  const metadata = {
    createdDate,
    evaluationUrl: `/evaluations/${_id}`,
    feedbackUrl: `/user/${user.id}/evaluations/${_id}/feedback`,
    objectivesUrl: `/user/${user.id}/evaluations/${_id}/objectives`,
    id: _id,
    usersName: user.name,
    status,
    templateName: template.name,
  };

  const viewModel = {
    id: _id,
    subject: user,
    status,
    template,
    skillGroups: arrayToKeyedObject(skillGroups),
    skills: arrayToKeyedObject(skills),
  };

  return Object.freeze({
    id: _id ? _id.toString() : null,
    user,
    createdDate,
    template,
    skillGroups,
    status,
    dataModel() {
      return { user, createdDate, template, skillGroups, status, skills };
    },
    subjectMetadataViewModel() {
      return Object.assign({}, metadata, { view: VIEW.SUBJECT });
    },
    mentorMetadataViewModel() {
      return Object.assign({}, metadata, { view: VIEW.MENTOR });
    },
    adminMetadataViewModel() {
      return Object.assign({}, metadata, { view: VIEW.ADMIN });

    },
    subjectEvaluationViewModel() {
      return Object.assign({}, viewModel, { view: VIEW.SUBJECT });
    },
    mentorEvaluationViewModel() {
      return Object.assign({}, viewModel, { view: VIEW.MENTOR });
    },
    adminEvaluationViewModel() {
      return Object.assign({}, viewModel, { view: VIEW.ADMIN });
    },
    newEvaluationEmail() {
      return {
        recipients: user.email,
        subject: 'A new evaluation has been triggered',
        body: `Please visit ${`${HOST}/#/evaluations/${_id}`} to complete your evaluation.`,
      };
    },
    feedbackData() {
      return ({ id: _id.toString(), createdDate });
    },
    getSelfEvaluationCompleteEmail(mentor) {
      return {
        recipients: mentor.email,
        subject: `${user.name} has completed their self evaluation`,
        body: `Please book a meeting with them and and visit ${`${HOST}/#/evaluations/${_id}`} to review their evaluation.`,
      };
    },
    findSkill(skillId) {
      const val = R.find(s => skillId === s.id, skills);
      return val ? skill(val) : null;
    },
    updateSkill(skillId, newSkillStatus) {
      return {
        id: _id,
        user,
        createdDate,
        template,
        skillGroups,
        skills: skills.map(s => (s.id === skillId ? skill(s).updateStatus(newSkillStatus) : s)),
        status,
      };
    },
    isNewEvaluation() {
      return status === STATUS.NEW;
    },
    selfEvaluationComplete() {
      return {
        id: _id,
        user,
        createdDate,
        template,
        skillGroups,
        skills,
        status: STATUS.SELF_EVALUATION_COMPLETE,
      };
    },
    selfEvaluationCompleted() {
      return status === STATUS.SELF_EVALUATION_COMPLETE;
    },
    mentorReviewComplete() {
      return {
        id: _id,
        user,
        createdDate,
        template,
        skillGroups,
        skills,
        status: STATUS.MENTOR_REVIEW_COMPLETE,
      };
    },
    mentorReviewCompleted() {
      return status === STATUS.MENTOR_REVIEW_COMPLETE;
    },
    mergePreviousEvaluation(previousEvaluation) {
      const updateSkill = (skillToUpdate) => {
        const previousSkill = previousEvaluation.findSkill(skillToUpdate.id);
        if (!previousSkill) {
          return Object.assign({}, skillToUpdate, { status: { previous: null, current: null } });
        }
        return Object.assign({}, skillToUpdate, {
          status: {
            previous: previousSkill.currentStatus(),
            current: previousSkill.statusForNextEvaluation(),
          },
        });
      };
      const updatedSkills = previousEvaluation ? R.map(updateSkill, skills) : skills;
      return evaluation({
        _id,
        user,
        createdDate,
        template,
        skillGroups,
        skills: updatedSkills,
        status: STATUS.NEW,
      });
    },
  });
};

export default evaluation;
export const newEvaluation = (template: Template, user: User, allSkills: TemplateSkill[], date: Date = new Date()) => {
  const { skillGroups, skills } = template.createSkillGroups(allSkills);
  return evaluation({
    _id: null,
    user: user.evaluationData(),
    createdDate: date,
    status: STATUS.NEW,
    template: template.evaluationData(),
    skillGroups,
    skills,
  });
};

