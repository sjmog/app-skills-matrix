import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Button, Label, Alert } from 'react-bootstrap';
import { Link } from 'react-router';

import { actions, EVALUATION_STATUS, EVALUATION_VIEW } from '../../../modules/user/evaluations';
import * as selectors from '../../../modules/user';
import Matrix from '../../common/matrix/Matrix';
import PageHeader from './../../common/PageHeader';

import './evaluation.scss'

const { MENTOR, SUBJECT, ADMIN } = EVALUATION_VIEW;
const { NEW, SELF_EVALUATION_COMPLETE, MENTOR_REVIEW_COMPLETE } = EVALUATION_STATUS;

const alertText = (view, status) => {
  let text;

  if (view === MENTOR && status === NEW) {
    text = "You can't review this evaluation until your mentee has completed their self-evaluation.";
  } else if (view === MENTOR && status === SELF_EVALUATION_COMPLETE) {
    text = 'Please review this evaluation.';
  } else if (view === MENTOR && status === MENTOR_REVIEW_COMPLETE) {
    text = 'You have reviewed this evaluation.';
  } else if (view === SUBJECT && status === SELF_EVALUATION_COMPLETE) {
    text = 'You have completed your self-evaluation.';
  } else if (view === SUBJECT && status === MENTOR_REVIEW_COMPLETE) {
    text = 'Your evaluation is complete.';
  } else {
    text = false
  }

  return text;
};

class EvaluationPageHeader extends React.Component {
  constructor(props) {
    super(props);
    this.evaluationComplete = this.evaluationComplete.bind(this);
  }

  evaluationComplete() {
    this.props.actions.evaluationComplete(this.props.evaluationId);
  }

  render() {
    const { view, templateName, subjectName, status } = this.props;

    if (view === MENTOR) {
      return (
        <Row>
          <PageHeader
            alertText={alertText(view, status)}
            title={subjectName}
            btnOnClick={this.evaluationComplete}
            btnDisabled={status !== SELF_EVALUATION_COMPLETE}
            btnText='Review complete'
          />
        </Row>
      )
    }

    if (view === SUBJECT) {
      return (
        <Row>
          <PageHeader
            alertText={alertText(view, status)}
            title='Evaluation'
            subTitle={templateName}
          />
        </Row>
      )
    }

    if (view === ADMIN) {
      return (
        <Row>
          <PageHeader
            title={subjectName}
          />
        </Row>
      )
    }
    return false;
  }
}

EvaluationPageHeader.propTypes = {
  view: PropTypes.string.isRequired,
  templateName:  PropTypes.string.isRequired,
  subjectName:  PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  evaluationId: PropTypes.string.isRequired,
};

export default connect(
  function mapStateToProps(state, props) {
    const evalId = props.evaluationId;

    return ({
      view: selectors.getView(state, evalId),
      templateName: selectors.getTemplateName(state, evalId),
      subjectName: selectors.getSubjectName(state, evalId),
      status:  selectors.getEvaluationStatus(state, evalId),
    })
  },
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(actions, dispatch)
    };
  }
)(EvaluationPageHeader);