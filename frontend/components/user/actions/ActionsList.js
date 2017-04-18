import React, { PropTypes } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import moment from 'moment';

const ActionsList = ({ actions }) =>
  (
    <div>
      {
        actions.map(
          ({ createdDate, actions }) =>
            <div key={createdDate}>
              <h2>{moment(createdDate).format('MMM Do YYYY')}</h2>
              <ListGroup>
                {
                  actions.map(({ skill }) =>
                    <ListGroupItem key={skill.name}>{skill.name}</ListGroupItem>
                  )
                }
              </ListGroup>
            </div>
        )
      }
    </div>
  );

ActionsList.propTypes = {
  actions: PropTypes.array.isRequired,
};

export default ActionsList
