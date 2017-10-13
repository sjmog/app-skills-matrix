import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row } from 'react-bootstrap';

import { actionCreators, EVALUATION_STATUS, EVALUATION_VIEW } from '../../../modules/user/evaluations';
import * as selectors from '../../../modules/user';
import PageHeader from '../../common/PageHeader';

import './evaluation.scss';

const { MENTOR, SUBJECT, ADMIN, LINE_MANAGER, LINE_MANAGER_AND_MENTOR } = EVALUATION_VIEW;
const { NEW, SELF_EVALUATION_COMPLETE, MENTOR_REVIEW_COMPLETE } = EVALUATION_STATUS;

const subjectText = {
  NEW: 'You should self-evaluate.',
  SELF_EVALUATION_COMPLETE: 'You have completed your self-evaluation.',
  MENTOR_REVIEW_COMPLETE: 'Your evaluation is complete.',
  COMPLETE: 'Your evaluation is complete.',
};

const mentorText = {
  NEW: 'You can\'t review this evaluation until your mentee has completed their self-evaluation.',
  SELF_EVALUATION_COMPLETE: 'Please review this evaluation.',
  MENTOR_REVIEW_COMPLETE: 'This evaluation is waiting for your mentee to review with their manager.',
  COMPLETE: 'This evaluation is complete.',
};

const lineManagerText = {
  NEW: 'You can\'t review this evaluation until your report has completed their self-evaluation',
  SELF_EVALUATION_COMPLETE: 'You can\'t review this evaluation until your report has completed their self-evaluation.',
  MENTOR_REVIEW_COMPLETE: 'Please review this evaluation.',
  COMPLETE: 'This evaluation is complete.',
};

const lineManagerAndMentorText = {
  NEW: 'You can\'t review this evaluation until your report has completed their self-evaluation',
  SELF_EVALUATION_COMPLETE: 'Please review this evaluation.',
  MENTOR_REVIEW_COMPLETE: 'Please review this evaluation.',
  COMPLETE: false,
};


const alertText = (view, status) => {
  if (view === MENTOR) {
    return mentorText[status];
  }

  if (view === SUBJECT) {
    return subjectText[status];
  }

  if (view === LINE_MANAGER) {
    return lineManagerText[status];
  }

  if (view === LINE_MANAGER_AND_MENTOR) {
    return lineManagerAndMentorText[status];
  }

  return false;
};

// TODO fix types
type EvaluationPageHeaderProps = {
  view: string,
  evaluationName: string,
  subjectName: string,
  status: string,
  evaluationId: string,
  actions: any,
};

class EvaluationPageHeader extends React.Component<EvaluationPageHeaderProps, any> {
  constructor(props) {
    super(props);
    this.evaluationComplete = this.evaluationComplete.bind(this);
  }

  evaluationComplete() {
    this.props.actions.evaluationComplete(this.props.evaluationId);
  }

  render() {
    const { view, evaluationName, subjectName, status } = this.props;

    if (view === LINE_MANAGER_AND_MENTOR) {
      return (
        <Row>
          <PageHeader
            alertText={alertText(view, status)}
            title={subjectName}
            btnOnClick={this.evaluationComplete}
            btnDisabled={status !== SELF_EVALUATION_COMPLETE && status !== MENTOR_REVIEW_COMPLETE}
            btnText="Complete Evaluation"
          />
        </Row>
      );
    }

    if (view === MENTOR) {
      return (
        <Row>
          <PageHeader
            alertText={alertText(view, status)}
            title={subjectName}
            btnOnClick={this.evaluationComplete}
            btnDisabled={status !== SELF_EVALUATION_COMPLETE}
            btnText="Review complete"
          />
        </Row>
      );
    }

    if (view === LINE_MANAGER) {
      return (
        <Row>
          <PageHeader
            alertText={alertText(view, status)}
            title={subjectName}
            btnOnClick={this.evaluationComplete}
            btnDisabled={status !== MENTOR_REVIEW_COMPLETE}
            btnText="Complete Evaluation"
          />
        </Row>
      );
    }

    if (view === SUBJECT) {
      return (
        <Row>
          <PageHeader
            alertText={alertText(view, status)}
            title="Evaluation"
            subTitle={evaluationName}
          />
        </Row>
      );
    }

    if (view === ADMIN) {
      return (
        <Row>
          <PageHeader
            title={subjectName}
          />
        </Row>
      );
    }
    return false;
  }
}

export default connect(
  (state, props) => {
    const evalId = props.evaluationId;

    return ({
      view: selectors.getView(state, evalId),
      evaluationName: selectors.getEvaluationName(state, evalId),
      subjectName: selectors.getSubjectName(state, evalId),
      status: selectors.getEvaluationStatus(state, evalId),
    });
  },
  dispatch => ({
    actions: bindActionCreators(actionCreators, dispatch),
  }),
)(EvaluationPageHeader);
