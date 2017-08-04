import * as React from 'react';
import { Col, ListGroup, Accordion, Panel } from 'react-bootstrap';

import EvaluationsList from './../EvaluationsList';

type MenteeEvaluationsProps = {
  menteeEvaluations: any[],
};

const MenteeEvaluations = ({ menteeEvaluations }: MenteeEvaluationsProps) => (
  <div>
    {
      menteeEvaluations.length ? <Col xs={12} md={12}>
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
            ))
        }
      </Col>
        : false
    }
  </div>
);

export default MenteeEvaluations;
