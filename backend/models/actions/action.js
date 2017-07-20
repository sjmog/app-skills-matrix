module.exports = ({ type, user, skill, evaluation }) => Object.freeze({
  get viewModel() {
    // may want to map as these aren't really appropriate for a viewmodel (up to you @charlie)
    return ({ type, user, skill, evaluation });
  },
});

module.exports.newAction = (type, user, skill, evaluation) => ({
  type,
  user: user.feedbackData(),
  skill: skill.feedbackData(),
  evaluation: evaluation.feedbackData,
  createdDate: new Date(),
});

