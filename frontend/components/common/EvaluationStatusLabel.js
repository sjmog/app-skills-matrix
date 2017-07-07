import React, { PropTypes } from 'react';
import { Label } from 'react-bootstrap';

import { EVALUATION_STATUS } from '../../modules/user/evaluations'
const { NEW, SELF_EVALUATION_COMPLETE, MENTOR_REVIEW_COMPLETE } = EVALUATION_STATUS;

const EvaluationStatusLabel = ({ status }) => {
  switch(status) {
   case NEW:
      return (<h4><Label bsStyle="primary">New</Label></h4>);
      break;
    case SELF_EVALUATION_COMPLETE:
      return (<h4><Label bsStyle="info">Self evaluation complete</Label></h4>);
      break;
    case MENTOR_REVIEW_COMPLETE:
      return (<h4><Label bsStyle="success">Mentor review complete</Label></h4>);
      break;
  }
};

EvaluationStatusLabel.propTypes = {
  status: PropTypes.string.isRequired,
};

export default EvaluationStatusLabel;