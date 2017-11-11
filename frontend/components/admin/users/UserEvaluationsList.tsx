import * as React from 'react';
import { Table, Button, Panel } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as moment from 'moment';

import * as selectors from '../../../modules/admin';
import EvaluationStatusSelector from  './EvaluationStatusSelector';

import '../../user/dashboard/evaluationsList.scss';

type UserEvaluationsListProps = {
  userId: string,
  evaluations: EvaluationMetadataViewModel[],
};

const UserEvaluationsList = ({ evaluations }: UserEvaluationsListProps) => {
  if (evaluations.length === 0) {
    return (<p>User has no evaluations</p>);
  }

  return (
    <Table responsive className="evaluations-list">
      <thead>
      <tr>
        <th>Date</th>
        <th>Type</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      {
        evaluations.map(({ id, createdDate, template, status, evaluationUrl, feedbackUrl, objectivesUrl }) =>
          (<tr key={id}>
            <td>{moment(createdDate).format('D MMM YYYY')}</td>
            <td>{template.name}</td>
            <td>
              <EvaluationStatusSelector evaluationId={id}/>
            </td>
            <td>
              <div>
                <Button href={evaluationUrl} className="action-btn">
                  View
                </Button>
                <Button href={feedbackUrl} className="action-btn">
                  Feedback
                </Button>
                <Button href={objectivesUrl} className="action-btn">
                  Objectives
                </Button>
              </div>
            </td>
          </tr>),
        )
      }
      </tbody>
    </Table>
  );
};

export default connect(
  (state, { userId }) => ({
    evaluations: selectors.getSortedEvaluationsByUserId(state, userId),
  }),
)(UserEvaluationsList);
