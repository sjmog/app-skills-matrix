module.exports = ({ user, skill, evaluation }) => Object.freeze({
  get viewModel() {
    // may want to map as these aren't really appropriate for a viewmodel (up to you @charlie)
    return ({ user, skill, evaluation });
  }
});

module.exports.newFeedback = (user, skill, evaluation) => {
  return ({
    user: user.feedbackData,
    skill: skill.feedbackData,
    evaluation: evaluation.feedbackData,
    requestedDate: new Date(),
  });
};

