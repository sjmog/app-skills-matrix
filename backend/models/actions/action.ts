import { User, UserFeedback } from '../users/user';
import { Skill, UnhydratedSkill } from '../evaluations/skill';
import { Evaluation, EvaluationFeedback } from '../evaluations/evaluation';

type UnhydratedAction = {
  type: string,
  user: UserFeedback,
  skill: UnhydratedSkill,
  evaluation: EvaluationFeedback,
};

export type Action = {
  viewModel: () => UnhydratedAction,
};

export default ({ type, user, skill, evaluation }: UnhydratedAction): Action => Object.freeze({
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
