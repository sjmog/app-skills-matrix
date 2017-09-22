import * as keymirror from 'keymirror';
import * as R from 'ramda';

export const SKILL_STATUS = keymirror({
  NEW: null,
  ATTAINED: null,
  NOT_ATTAINED: null,
  FEEDBACK: null,
  OBJECTIVE: null,
});

const STATUS_WITH_ACTION = keymirror({
  FEEDBACK: null,
  OBJECTIVE: null,
});

export type Skill = {
  id: number,
  currentStatus: () => string | null,
  statusForNextEvaluation: () => string | null,
  notes: () => string[],
  feedbackData: () => UnhydratedEvaluationSkill,
  addAction: (string) => boolean | string,
  removeAction: (string) => boolean | string,
  updateStatus: (string) => UnhydratedEvaluationSkill,
  addNote: (string) => UnhydratedEvaluationSkill,
  deleteNote: (string) => UnhydratedEvaluationSkill,
};

export default ({ id, name, criteria, type, questions, status, notes }: UnhydratedEvaluationSkill): Skill => Object.freeze({
  id,
  currentStatus() {
    return status.current;
  },
  statusForNextEvaluation() {
    return status.current === SKILL_STATUS.ATTAINED ? SKILL_STATUS.ATTAINED : null;
  },
  notes() {
    return R.is(Array, notes) ? notes : [];
  },
  feedbackData() {
    return ({ id, name, criteria, type, questions, status });
  },
  addAction(newStatus: string) {
    return (STATUS_WITH_ACTION[newStatus] && status.current !== newStatus) && STATUS_WITH_ACTION[newStatus];
  },
  removeAction(newStatus: string) {
    return (STATUS_WITH_ACTION[status.current] && status.current !== newStatus) && STATUS_WITH_ACTION[status.current];
  },
  updateStatus(newStatus: string) {
    return {
      id,
      name,
      criteria,
      type,
      questions,
      status: {
        previous: status.previous,
        current: newStatus,
      },
      notes,
    };
  },
    addNote(newNoteId: string) {
    return {
      id,
      name,
      criteria,
      type,
      questions,
      status,
      notes: R.is(Array, notes) ? [].concat(notes, newNoteId) : [newNoteId],
    };
  },
  deleteNote(noteId: string) {
    return {
      id,
      name,
      criteria,
      type,
      questions,
      status,
      notes: R.is(Array, notes) ? R.reject(R.equals(noteId), notes) : [],
    };
  },
});
