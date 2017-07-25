// @flow
import keymirror from 'keymirror';

export const SKILL_STATUS = keymirror({
  ATTAINED: null,
  NOT_ATTAINED: null,
  FEEDBACK: null,
  OBJECTIVE: null,
});

const STATUS_WITH_ACTION = keymirror({
  FEEDBACK: null,
  OBJECTIVE: null,
});

export type UnhydratedSkill = {
  id: string,
  name: string,
  type: string,
  criteria: string,
  questions: Array<{ name: string }>,
  status: { current: string | null, previous: string | null },
}

export type Skill = {
  id: string,
  currentStatus: () => string | null,
  statusForNextEvaluation: () => string | null,
  feedbackData: () => UnhydratedSkill,
  addAction: (string) => boolean | string,
  removeAction: (string) => boolean | string,
  updateStatus: (string) => UnhydratedSkill
}

export default ({ id, name, criteria, type, questions, status }: UnhydratedSkill): Skill => Object.freeze({
  id,
  currentStatus() {
    return status.current;
  },
  statusForNextEvaluation() {
    return status.current === SKILL_STATUS.ATTAINED ? SKILL_STATUS.ATTAINED : null;
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
    };
  },
});
