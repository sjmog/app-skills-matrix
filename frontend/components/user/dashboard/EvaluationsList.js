import React, { PropTypes } from 'react';
import { ListGroupItem } from 'react-bootstrap';
import moment from 'moment';

const EvaluationsList = ({ evaluations }) => (
  <div>
    {
      evaluations.map(({ id, createdDate, templateName, status, evaluationUrl, feedbackUrl}) =>
        (
          <ListGroupItem key={id} bsStyle={null}>
            <dl>
              <dt>date</dt>
              <dd>{moment(createdDate).format('D MMM YYYY')}</dd>
              <dt>type</dt>
              <dd>{templateName}</dd>
              <dt>status</dt>
              <dd>{status}</dd>
              <dt>actions</dt>
              <dd>
                <a href={evaluationUrl}>view</a>
                {' '}
                <a href={feedbackUrl}>feedback</a>
              </dd>
            </dl>
          </ListGroupItem>
        )
      )
    }
  </div>
);

EvaluationsList.propTypes = {
  evaluations: PropTypes.array.isRequired,
};

export default EvaluationsList
