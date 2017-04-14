const keymirror = require('keymirror');

const SKILL_STATUS = keymirror({
  ATTAINED: null,
  NOT_ATTAINED: null,
  FEEDBACK: null,
  OBJECTIVE: null
});

module.exports = ({ id, name, criteria, type, questions, status }) => ({
  get currentStatus() {
    return status.current;
  },
  get statusForNextEvaluation() {
    return status.current === SKILL_STATUS.ATTAINED ? SKILL_STATUS.ATTAINED : null
  },
  updateStatus(newStatus) {
    return {
      id,
      name,
      criteria,
      type,
      questions,
      status: {
        previous: status.previous,
        current: newStatus,
      }
    }
  }
});

module.exports.SKILL_STATUS = SKILL_STATUS;
