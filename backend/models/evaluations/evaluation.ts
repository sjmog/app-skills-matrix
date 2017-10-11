import * as keymirror from 'keymirror';
import * as R from 'ramda';

import { DatabaseObject } from '../../database';
import { Email } from '../../services/email';
import { User } from '../users/user';
import skill, { Skill, SKILL_STATUS } from './skill';
import { Skill as TemplateSkill } from '../matrices/skill';
import { EvaluationTemplate, Template } from '../matrices/template';
import { ObjectID } from 'mongodb';

const HOST = process.env.HOST;

export const STATUS = keymirror({
  NEW: null,
  SELF_EVALUATION_COMPLETE: null,
  MENTOR_REVIEW_COMPLETE: null,
  COMPLETE: null,
});

const VIEW = keymirror({
  SUBJECT: null,
  MENTOR: null,
  ADMIN: null,
});

type UnhydratedEvaluation = {
  user: EvaluationUser,
  createdDate: Date,
  template: EvaluationTemplate,
  skillGroups: EvaluationSkillGroup[],
  skills: UnhydratedEvaluationSkill[],
  status: string,
};

export type EvaluationUpdate = {
  id: string;
  user: EvaluationUser,
  createdDate: Date,
  template: EvaluationTemplate,
  skillGroups: UnhydratedSkillGroup[],
  skills: UnhydratedEvaluationSkill[],
  status: string,
  error?: boolean,
};

export type EvaluationFeedback = {
  id: string,
  createdDate: Date,
};

export type Evaluation = {
  id: string | null,
  user: EvaluationUser,
  createdDate: Date,
  template: EvaluationTemplate,
  skillGroups: UnhydratedSkillGroup[],
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
  findSkill: (skillId: number) => Skill | null,
  updateSkill: (skillId: number, status: string, isOwner: boolean, isMentor: boolean, isLineManager: boolean) => ErrorMessage | EvaluationUpdate,
  addSkillNote: (skillId: number, note: string) => EvaluationUpdate,
  deleteSkillNote: (skillId: number, note: string) => EvaluationUpdate;
  mergePreviousEvaluation: (previousEvaluation: Evaluation) => Evaluation,
  moveToNextStatus: (isOwner: boolean, isMentor: boolean, isLineManager: boolean) => ErrorMessage | EvaluationUpdate,
  getNoteIds: () => string[];
};

const arrayToKeyedObject = <T extends { id: string | number }>(evaluationId: string, arr: T[]) =>
  arr.reduce((acc, item) => Object.assign({}, acc, { [item.id]: item }), {});

const uniqueId = (evaluationId, id) => `${evaluationId}_${id}`;

const makeSkillsUnique = (evaluationId, skillGroups: EvaluationSkillGroup[]) =>
  R.map(skillGroup => Object.assign({},
    skillGroup,
    { skills: R.map(skillId => uniqueId(evaluationId, skillId), R.prop('skills', skillGroup)) }), skillGroups);

const arrayToUniquelyKeyedObject = (evaluationId, arr: UnhydratedEvaluationSkill[]) =>
  R.reduce(
    (acc, item) => {
      const uid = uniqueId(evaluationId, item.id);
      return Object.assign({}, acc, { [uid]: item });
    }, {}, arr);

const evaluation = ({ _id, user, createdDate, template, skillGroups, status, skills }: DatabaseObject & UnhydratedEvaluation): Evaluation => {
  const metadata = {
    createdDate,
    evaluationUrl: `/evaluations/${_id}`,
    feedbackUrl: `/evaluations/${_id}/feedback`,
    objectivesUrl: `/evaluations/${_id}/objectives`,
    id: _id.toString(),
    usersName: user.name,
    status,
    templateName: template.name,
  };

  const viewModelSkills = arrayToUniquelyKeyedObject(_id, skills);

  const viewModel = {
    id: _id.toString(),
    subject: user,
    status,
    template,
    skills: viewModelSkills,
    skillUids: R.keys(viewModelSkills),
    skillGroups: arrayToKeyedObject(_id.toString(), makeSkillsUnique(_id, skillGroups)),
    createdDate,
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
    updateSkill(skillId, newSkillStatus, isOwner, isMentor, isLineManager) {
      const updateSkill = () => ({
        id: _id.toString(),
        user,
        createdDate,
        template,
        skillGroups,
        skills: skills.map(s => (s.id === skillId ? skill(s).updateStatus(newSkillStatus) : s)),
        status,
      });

      if (isOwner && status === STATUS.NEW) {
        return updateSkill();
      }
      if (isMentor && status === STATUS.SELF_EVALUATION_COMPLETE) {
        return updateSkill();
      }
      if (isLineManager && status === STATUS.MENTOR_REVIEW_COMPLETE) {
        return updateSkill();
      }
      return { error: true, message: `User does not have permission to move from ${status}` };
    },
    addSkillNote(skillId: number, noteId: string) {
      return {
        id: _id.toString(),
        user,
        createdDate,
        template,
        skillGroups,
        skills: skills.map(s => (s.id === skillId ? skill(s).addNote(noteId) : s)),
        status,
      };
    },
    deleteSkillNote(skillId: number, noteId: string) {
      return {
        id: _id.toString(),
        user,
        createdDate,
        template,
        skillGroups,
        skills: skills.map(s => (s.id === skillId ? skill(s).deleteNote(noteId) : s)),
        status,
      };
    },
    moveToNextStatus(isOwner, isMentor, isLineManager) {
      const nextStatus = newStatus => ({
        id: _id.toString(),
        user,
        createdDate,
        template,
        skillGroups,
        skills,
        status: newStatus,
      });
      if (isOwner && status === STATUS.NEW) {
        return nextStatus(STATUS.SELF_EVALUATION_COMPLETE);
      }
      if (isMentor && status === STATUS.SELF_EVALUATION_COMPLETE) {
        return nextStatus(STATUS.MENTOR_REVIEW_COMPLETE);
      }
      if (isLineManager && status === STATUS.MENTOR_REVIEW_COMPLETE) {
        return nextStatus(STATUS.COMPLETE);
      }
      return { error: true, message: `User does not have permission to move from ${status}` };
    },
    mergePreviousEvaluation(previousEvaluation) {
      const updateSkill = (skillToUpdate) => {
        const previousSkill = previousEvaluation.findSkill(skillToUpdate.id);
        if (!previousSkill) {
          return Object.assign({}, skillToUpdate, { status: { previous: SKILL_STATUS.NEW, current: null } });
        }

        return Object.assign({}, skillToUpdate, {
          status: {
            previous: previousSkill.currentStatus(),
            current: previousSkill.statusForNextEvaluation(),
          },
          notes: previousSkill.notes(),
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
    getNoteIds() {
      const notes = R.map(R.prop('notes'), skills);
      return R.flatten(R.reject(R.isNil, notes));
    },
  });
};

export default evaluation;
export const newEvaluation = (template: Template, user: User, allSkills: TemplateSkill[], date: Date = new Date()) => {
  const { skillGroups, skills } = template.createSkillGroups(allSkills);
  return evaluation({
    _id: new ObjectID(),
    user: user.evaluationData(),
    createdDate: date,
    status: STATUS.NEW,
    template: template.evaluationData(),
    skillGroups,
    skills,
  });
};

