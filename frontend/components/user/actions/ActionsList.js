import React, { PropTypes } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import moment from 'moment';
import CopyToClipboard from 'react-copy-to-clipboard';
import './actionList.scss';

const ActionsList = ({ actions }) =>
  (
    <div>
      {
        actions.map(
          ({createdDate, actions}) =>
            <div key={createdDate}>
              <h2>{moment(createdDate).format('MMM Do YYYY')}</h2>
              <ListGroup>
                {
                  actions.map(({skill}) =>
                    <ListGroupItem key={skill.name}>
                      {skill.name}
                      <CopyToClipboard text={skill.name}>
                        <button
                          className={`btn btn-default btn-copy`}>
                          Copy to clipboard
                        </button>
                      </CopyToClipboard>
                    </ListGroupItem>
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
