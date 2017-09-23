import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Button } from 'react-bootstrap';
import * as moment from 'moment';

import * as selectors from '../../../modules/user';
import EvaluationStatusLabel from '../../common/EvaluationStatusLabel';
import { EVALUATION_VIEW, EVALUATION_STATUS } from '../../../modules/user/evaluations';

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

type EvaluationListRowProps = {
  evaluationId: string,
  subject: UserDetailsViewModel,
  createdDate: string,
  templateName: string,
  status: string,
  evaluationUrl: string,
  feedbackUrl: string,
  objectivesUrl: string,
  view: string,
};

class EvaluationListRow extends React.Component<EvaluationListRowProps> {
  render() {
    const { subject, evaluationId, createdDate, templateName, status, evaluationUrl, feedbackUrl, objectivesUrl, view } = this.props;
    return (
      <tr key={evaluationId}>
        <td>{subject}</td>
        <td>{moment(createdDate).format('D MMM YYYY')}</td>
        <td>{templateName}</td>
        <td>
          <EvaluationStatusLabel status={status}/>
        </td>
        <td>
          <div>
            <Link to={evaluationUrl}>
              {evaluationBtn(status, view)}
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
      </tr>
    );
  }
}

export default connect((state, { evaluationId }) => ({
  subject: selectors.getSubjectName(state, evaluationId),
  createdDate: selectors.getEvaluationDate(state, evaluationId),
  templateName: selectors.getEvaluationName(state, evaluationId),
  status: selectors.getEvaluationStatus(state, evaluationId),
  evaluationUrl: `/evaluations/${evaluationId}`,
  feedbackUrl: `/evaluations/${evaluationId}/feedback`,
  objectivesUrl: `/evaluations/${evaluationId}/objectives`,
  view: selectors.getView(state, evaluationId),
}))(EvaluationListRow);

