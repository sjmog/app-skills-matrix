import * as R from 'ramda';

import FeedBackRequiredMsg from './FeedbackRequiredMsg';
import { EVALUATION_STATUS, EVALUATION_VIEW } from '../../../modules/user/evaluations';
const { MENTOR, SUBJECT, ADMIN, LINE_MANAGER, LINE_MANAGER_AND_MENTOR } = EVALUATION_VIEW;
const { NEW, SELF_EVALUATION_COMPLETE, MENTOR_REVIEW_COMPLETE, COMPLETE } = EVALUATION_STATUS;

const statusDependentPropsInit = (skillsRequiringFeedback: string[]) => ({
  [MENTOR]: {
    [NEW]: {
      alert: `You can't review this evaluation until your mentee has completed their self-evaluation.`,
      disableBtn: true,
    },
    [SELF_EVALUATION_COMPLETE]: {
      alert:  skillsRequiringFeedback.length === 0 ? 'Please review this evaluation.' : FeedBackRequiredMsg({ skillsRequiringFeedback }),
      disableBtn: skillsRequiringFeedback.length !== 0,
    },
    [MENTOR_REVIEW_COMPLETE]: {
      alert: 'This evaluation is waiting for your mentee to review with their manager.',
      disableBtn: true,
    },
    [COMPLETE]: {
      alert: 'This evaluation is complete.',
      disableBtn: true,
    },
  },
  [SUBJECT]: {
    [NEW]: {
      alert: 'You need to complete your self-evaluation.',
    },
    [SELF_EVALUATION_COMPLETE]: {
      alert: 'You have completed your self-evaluation. It will now be reviewed by your mentor.',
    },
    [MENTOR_REVIEW_COMPLETE]: {
      alert: 'Your evaluation has been reviewed by your mentor and needs reviewing by your line manager.',
    },
    [COMPLETE]: {
      alert: 'Your evaluation is complete.',
    },
  },
  [LINE_MANAGER]: {
    [NEW]: {
      alert: 'You can\'t review this evaluation until your report has completed their self-evaluation and it has been reviewed by their mentor.',
      disableBtn: true,
    },
    [SELF_EVALUATION_COMPLETE]: {
      alert: 'You can\'t review this evaluation until it has been reviewed by the mentor of your report.',
      disableBtn: true,
    },
    [MENTOR_REVIEW_COMPLETE]: {
      alert: 'Please review this evaluation.',
      disableBtn: false,
    },
    [COMPLETE]: {
      alert: 'This evaluation is complete.',
      disableBtn: true,
    },
  },
  [LINE_MANAGER_AND_MENTOR]: {
    [NEW]: {
      alert: 'You can\'t review this evaluation until your report has completed their self-evaluation',
      disableBtn: true,
    },
    [SELF_EVALUATION_COMPLETE]: {
      alert: skillsRequiringFeedback.length === 0 ? 'Please review this evaluation.' : FeedBackRequiredMsg({ skillsRequiringFeedback }),
      disableBtn: skillsRequiringFeedback.length !== 0,
    },
    [MENTOR_REVIEW_COMPLETE]: {
      alert: 'Please review this evaluation.',
      disableBtn: false,
    },
    [COMPLETE]: {
      alert: 'This evaluation is complete',
      disableBtn: true,
    },
  },
});

export default (skillsRequiringFeedback: string[], subjectName: string, evaluationName: string, onClick: () => void, status: string)  => {
  const statusDependentProps = statusDependentPropsInit(skillsRequiringFeedback);
  const alert = view => R.path([view, status, 'alert'], statusDependentProps);
  const disableBtn = view => R.path([view, status, 'disableBtn'], statusDependentProps);

  return {
    [MENTOR]: {
      title: subjectName,
      btnText: 'Review complete',
      btnOnClick: onClick,
      alert: alert(MENTOR),
      btnDisabled: disableBtn(MENTOR),
    },
    [SUBJECT]: {
      title: 'Evaluation',
      subTitle: evaluationName,
      alert: alert(SUBJECT),
    },
    [LINE_MANAGER]: {
      title: subjectName,
      btnOnClick: onClick,
      btnText: 'Evaluation Complete',
      alert: alert(LINE_MANAGER),
      btnDisabled: disableBtn(LINE_MANAGER),
    },
    [LINE_MANAGER_AND_MENTOR]: {
      title: subjectName,
      btnOnClick: onClick,
      btnText: 'Evaluation Complete',
      alert: alert(LINE_MANAGER_AND_MENTOR),
      btnDisabled: disableBtn(LINE_MANAGER_AND_MENTOR),
    },
    [ADMIN]: {
      title: subjectName,
    },
  };
};
