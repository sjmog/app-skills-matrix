import * as React from 'react';
import { Col } from 'react-bootstrap';

import EvaluationsList from './../EvaluationsList';

type EvaluationsProps = {
  evaluations: any[],
};

const MyEvaluations = ({ evaluations }: EvaluationsProps) => (
  <div>
    <Col xs={12} md={12}>
      <h2>My Evaluations</h2>
      <EvaluationsList evaluations={evaluations} />
    </Col>
  </div>
);

export default MyEvaluations;
