import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Button, Label, Alert } from 'react-bootstrap';
import { Link } from 'react-router';

import { actions, EVALUATION_STATUS, EVALUATION_VIEW } from '../../../modules/user/evaluation';
import * as selectors from '../../../modules/user';
import Matrix from '../../common/matrix/Matrix';
import PageHeader from './../../common/PageHeader';

import './evaluation.scss'

const { MENTOR, SUBJECT } = EVALUATION_VIEW;
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
    const { evaluationId, view, templateName, firstCategory, subjectName, status } = this.props;

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
            btnUrl={`evaluations/${evaluationId}/category/${firstCategory}`}
            btnDisabled={status === MENTOR_REVIEW_COMPLETE || status === SELF_EVALUATION_COMPLETE}
            btnText='Begin evaluation'
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
  firstCategory:  PropTypes.string.isRequired,
  subjectName:  PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  evaluationId: PropTypes.string.isRequired,
};

export default connect(
  function mapStateToProps(state) {
    return ({
      view: selectors.getView(state),
      templateName: selectors.getTemplateName(state),
      firstCategory: selectors.getFirstCategory(state),
      subjectName: selectors.getSubjectName(state),
      status: selectors.getEvaluationStatus(state),
    })
  },
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(actions, dispatch)
    };
  }
)(EvaluationPageHeader);