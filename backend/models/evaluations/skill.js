// @flow
import keymirror from 'keymirror';

const SKILL_STATUS = keymirror({
  ATTAINED: null,
  NOT_ATTAINED: null,
  FEEDBACK: null,
  OBJECTIVE: null,
});

const STATUS_WITH_ACTION = keymirror({
  FEEDBACK: null,
  OBJECTIVE: null,
});

type UnhydratedSkill = {
  id: string,
  name: string,
  type: string,
  criteria: string,
  questions: Array<{ name: string }>,
  status: { current: string, previous: string },
}

module.exports = ({ id, name, criteria, type, questions, status }: UnhydratedSkill) => Object.freeze({
  id,
  currentStatus() {
    return status.current;
  },
  statusForNextEvaluation() {
    return status.current === SKILL_STATUS.ATTAINED ? SKILL_STATUS.ATTAINED : null;
  },
  feedbackData() {
    return ({ id, name, criteria, type, questions });
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

module.exports.SKILL_STATUS = SKILL_STATUS;
