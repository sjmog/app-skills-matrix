import React, { PropTypes } from 'react';
import { Table, Button, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router';
import moment from 'moment';

import './evaluationsList.scss';

const EvaluationsList = ({ evaluations }) => (
  <Table responsive>
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
          <td>{status}</td>
          <td>
            <div>
              <Link to={evaluationUrl}>
                <Button>
                  View
                </Button>
              </Link>
              <Link to={feedbackUrl}>
                <Button className='action-btn'>
                  Feedback
                </Button>
              </Link>
              <Link to={objectivesUrl}>
                <Button className='action-btn'>
                  Objectives
                </Button>
              </Link>
            </div>
          </td>
        </tr>
      )
    }
    </tbody>
  </Table>
);

EvaluationsList.propTypes = {
  evaluations: PropTypes.array.isRequired,
};

export default EvaluationsList
