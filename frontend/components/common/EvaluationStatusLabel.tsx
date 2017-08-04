import * as React from 'react';
import { Label } from 'react-bootstrap';

import { EVALUATION_STATUS } from '../../modules/user/evaluations';

const { NEW, SELF_EVALUATION_COMPLETE, MENTOR_REVIEW_COMPLETE } = EVALUATION_STATUS;

type EvaluationStatusLabelProps = {
  status: string,
};

const EvaluationStatusLabel = ({ status }: EvaluationStatusLabelProps) => {
  switch (status) {
    case NEW:
      return (<h4><Label bsStyle="primary">New</Label></h4>);
    case SELF_EVALUATION_COMPLETE:
      return (<h4><Label bsStyle="info">Self evaluation complete</Label></h4>);
    case MENTOR_REVIEW_COMPLETE:
      return (<h4><Label bsStyle="success">Mentor review complete</Label></h4>);
    default:
      return (<h4><Label bsStyle="success">Mentor review complete</Label></h4>);
  }
};

export default EvaluationStatusLabel;
