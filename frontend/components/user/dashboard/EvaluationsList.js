import React, { PropTypes } from 'react';
import { ListGroupItem } from 'react-bootstrap';
import moment from 'moment';

const EvaluationsList = ({ evaluations }) => (
  <div>
    {
      evaluations.map(({ id, createdDate, templateName, status, url}) =>
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
              <dd><a href={url}>view</a></dd>
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
