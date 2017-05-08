import React, { PropTypes } from 'react';
import { Label, Table, Button, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router';
import moment from 'moment';

import EvaluationStatusLabel from '../../common/EvaluationStatusLabel';

import '../../user/evaluationsList.scss';

const UserEvaluationsList = ({ evaluations }) => (
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
      evaluations.map(({ id, createdDate, templateName, status, evaluationUrl, feedbackUrl, objectivesUrl }) =>
        <tr key={id}>
          <td>{moment(createdDate).format('D MMM YYYY')}</td>
          <td>{templateName}</td>
          <td>
            <EvaluationStatusLabel status={status} />
          </td>
          <td>
            <div>
              <Button href={evaluationUrl} className='action-btn'>
                View
              </Button>
              <Button href={feedbackUrl} className='action-btn'>
                Feedback
              </Button>
              <Button href={objectivesUrl} className='action-btn'>
                Objectives
              </Button>
            </div>
          </td>
        </tr>
      )
    }
    </tbody>
  </Table>
);

UserEvaluationsList.propTypes = {
  evaluations: PropTypes.array.isRequired,
};

export default UserEvaluationsList
