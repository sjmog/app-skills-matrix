import React, { PropTypes } from 'react';
import { Col } from 'react-bootstrap';

import EvaluationsList from './../../common/EvaluationsList';

const Evaluations = ({ evaluations }) => (
  <div>
    <Col xs={12} md={12}>
      <h2>My Evaluations</h2>
      <EvaluationsList evaluations={evaluations} />
    </Col>
  </div>
);

Evaluations.propTypes = {
  evaluations: PropTypes.array,
};

export default Evaluations;
