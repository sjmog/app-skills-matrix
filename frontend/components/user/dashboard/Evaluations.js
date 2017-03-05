import React from 'react';
import { Col, ListGroup, ListGroupItem } from 'react-bootstrap';
import moment from 'moment'

const Evaluations = ({ evaluations }) => {
  return (<div>
      <Col xs={12} md={12}>
        <h2>My Evaluations</h2>
        <ListGroup>
          {evaluations.map((e) =>
            (<ListGroupItem key={e.id}>
              <dl>
                <dt>date</dt>
                <dd>{moment(e.createdDate).format('D MMM YYYY')}</dd>
                <dt>type</dt>
                <dd>{e.templateName}</dd>
                <dt>status</dt>
                <dd>{e.status}</dd>
                <dt>actions</dt>
                <dd><a href={e.url}>view</a></dd>
              </dl>
            </ListGroupItem>)
          )}
        </ListGroup>
      </Col>
    </div>
  );
};

export default Evaluations;
