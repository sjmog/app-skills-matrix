import * as React from 'react';
import { Col, ListGroup, Accordion, Panel } from 'react-bootstrap';

import EvaluationsList from './../EvaluationsList';

type EvaluationsTableProps = {
  evaluations: any[],
  title: string,
};

const EvaluationTable = ({ evaluations, title }: EvaluationsTableProps) => (
  <div>
    {
      evaluations.length ? <Col xs={12} md={12}>
        <h2>{title}</h2>
        {
          evaluations.map(
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

export default EvaluationTable;
