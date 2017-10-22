import * as React from 'react';
import { Table, Button } from 'react-bootstrap';
import * as moment from 'moment';

import EvaluationStatusLabel from '../../common/EvaluationStatusLabel';

import '../../user/dashboard/evaluationsList.scss';

type UserEvaluationsListProps = {
  evaluations: {
    id: string,
    createdDate: Date,
    template: TemplateViewModel,
    status: string,
    evaluationUrl: string,
    feedbackUrl: string,
    objectivesUrl: string,
  }[],
};

const UserEvaluationsList = ({ evaluations }: UserEvaluationsListProps) => (
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
              <EvaluationStatusLabel status={status} />
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

export default UserEvaluationsList;
