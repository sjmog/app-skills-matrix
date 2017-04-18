import React, { PropTypes } from 'react';
import { Table, Button, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router';
import moment from 'moment';

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
            <ButtonGroup>
              <Link to={evaluationUrl}>
                <Button>
                  View
                </Button>
              </Link>
              <Link to={feedbackUrl}>
                <Button>
                  Feedback
                </Button>
              </Link>
              <Link to={objectivesUrl}>
                <Button>
                  Objectives
                </Button>
              </Link>
            </ButtonGroup>
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
