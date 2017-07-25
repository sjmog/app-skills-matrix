// @flow
import type { User } from '../users/user';
import type { Skill } from '../evaluations/skill';
import type { Evaluation } from '../evaluations/evaluation';

type UnhydratedFlow = {
  type: string,
  user: string,
  skill: {},
  evaluation: {},
}

export default ({ type, user, skill, evaluation }: UnhydratedFlow) => Object.freeze({
  viewModel() {
    // may want to map as these aren't really appropriate for a viewmodel (up to you @charlie)
    return ({ type, user, skill, evaluation });
  },
});

export const newAction = (type: string, user: User, skill: Skill, evaluation: Evaluation) => ({
  type,
  user: user.feedbackData(),
  skill: skill.feedbackData(),
  evaluation: evaluation.feedbackData(),
  createdDate: new Date(),
});

