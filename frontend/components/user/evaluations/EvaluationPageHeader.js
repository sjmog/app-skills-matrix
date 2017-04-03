import React, { PropTypes } from 'react';
import { Row, Button, Label, Alert } from 'react-bootstrap';
import { Link } from 'react-router';

import { EVALUATION_STATUS, EVALUATION_VIEW } from '../../../modules/user/evaluation';
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

const EvaluationPageHeader = ({ view, templateName, userName, firstCategory, id, status, evaluationComplete }) => {
  if (view === MENTOR) {
    return (
      <Row>
        <PageHeader
          alertText={alertText(view, status)}
          title={userName}
          btnOnClick={evaluationComplete}
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
        btnUrl={`evaluations/${id}/category/${firstCategory}`}
        btnDisabled={status === MENTOR_REVIEW_COMPLETE || status === SELF_EVALUATION_COMPLETE}
        btnText='Begin evaluation'
        />
      </Row>
    )
  }

  return false;
};

EvaluationPageHeader.propTypes = {
  templateName: PropTypes.string.isRequired,
  firstCategory: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  evaluationComplete: PropTypes.func,
};

export default EvaluationPageHeader;
