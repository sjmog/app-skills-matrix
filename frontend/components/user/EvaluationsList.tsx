import * as React from 'react';
import { Table, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import * as moment from 'moment';

import EvalutionStatusLabel from '../common/EvaluationStatusLabel';
import { EVALUATION_VIEW, EVALUATION_STATUS } from '../../modules/user/evaluations';
import './evaluationsList.scss';

const { MENTOR, SUBJECT, LINE_MANAGER, LINE_MANAGER_AND_MENTOR } = EVALUATION_VIEW;
const { NEW, SELF_EVALUATION_COMPLETE, MENTOR_REVIEW_COMPLETE } = EVALUATION_STATUS;

const evaluationBtn = (status, view) => {
  if (status === NEW && view === SUBJECT) {
    return <Button bsStyle="primary">Evaluate</Button>;
  }

  if ((status === MENTOR_REVIEW_COMPLETE || status === SELF_EVALUATION_COMPLETE) && view === LINE_MANAGER_AND_MENTOR) {
    return <Button bsStyle="primary">Review</Button>;
  }

  if (status === SELF_EVALUATION_COMPLETE && view === MENTOR) {
    return <Button bsStyle="primary">Review</Button>;
  }

  if (status === MENTOR_REVIEW_COMPLETE && view === LINE_MANAGER) {
    return <Button bsStyle="primary">Review</Button>;
  }

  return <Button>View</Button>;
};

type EvaluationsListProps = {
  evaluations: any[],
};

const EvaluationsList = ({ evaluations }: EvaluationsListProps) => (
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
        evaluations.map(({ id, createdDate, templateName, status, evaluationUrl, feedbackUrl, objectivesUrl, view }) =>
          (<tr key={id}>
            <td>{moment(createdDate).format('D MMM YYYY')}</td>
            <td>{templateName}</td>
            <td>
              <EvalutionStatusLabel status={status} />
            </td>
            <td>
              <div>
                <Link to={evaluationUrl}>
                  { evaluationBtn(status, view) }
                </Link>
                <Link to={feedbackUrl}>
                  <Button className="action-btn">
                  Feedback
                  </Button>
                </Link>
                <Link to={objectivesUrl}>
                  <Button className="action-btn">
                  Objectives
                  </Button>
                </Link>
              </div>
            </td>
          </tr>),
        )
      }
    </tbody>
  </Table>
);

export default EvaluationsList;
