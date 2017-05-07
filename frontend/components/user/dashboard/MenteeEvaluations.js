import React, { PropTypes } from 'react';
import { Col, ListGroup, Accordion, Panel } from 'react-bootstrap';

import EvaluationsList from './../../common/EvaluationsList';

const MenteeEvaluations = ({ menteeEvaluations }) => (
  <div>
    {
      menteeEvaluations.length
        ? <Col xs={12} md={12}>
            <h2>Mentee Evaluations</h2>
            {
              menteeEvaluations.map(
                ({ name, evaluations }, index) => (
                  <Accordion key={index}>
                    <Panel header={name} eventKey={index}>
                      <ListGroup fill>
                        <EvaluationsList evaluations={evaluations} />
                      </ListGroup>
                    </Panel>
                  </Accordion>
                )
              )
            }
          </Col>
        : false
    }
  </div>
);

MenteeEvaluations.propTypes = {
  menteeEvaluations: PropTypes.array,
};

export default MenteeEvaluations;
