import * as React from 'react';
import { Table } from 'react-bootstrap';

import EvaluationListRow from './EvaluationListRow';
import './evaluationsList.scss';

type EvaluationsListProps = {
  evaluations: string[],
};

const EvaluationsList = ({ evaluations }: EvaluationsListProps) => (
  <Table responsive className="evaluations-list">
    <thead>
      <tr>
        <th>User</th>
        <th>Date</th>
        <th>Type</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {evaluations.map(evaluationId => <EvaluationListRow evaluationId={evaluationId} />)}
    </tbody>
  </Table>
);

export default EvaluationsList;
