import * as React from 'react';
import { ListGroup, Accordion, Panel } from 'react-bootstrap';

import EvaluationsList from './../EvaluationsList';

type EvaluationsTableProps = {
  evaluations: any[],
  title?: string,
};

const EvaluationTable = ({ evaluations, title }: EvaluationsTableProps) => {
  if (!evaluations || evaluations.length === 0) {
    return null;
  }

  return (
    <div>
      {title ? <h2>{title}</h2> : false}
      {
        evaluations.map(
          ({ name, evaluations }, index) => (
            <Accordion key={index}>
              <Panel header={name} eventKey={index}>
                <ListGroup fill>
                  <EvaluationsList evaluations={evaluations}/>
                </ListGroup>
              </Panel>
            </Accordion>
          ))
      }
    </div>
  );
};

export default EvaluationTable;
