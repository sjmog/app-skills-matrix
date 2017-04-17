import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Grid, Alert, ListGroup, ListGroupItem } from 'react-bootstrap';
import moment from 'moment';

import { actions, ACTION_TYPES } from '../../../modules/user/actions';
import PageHeader from './../../common/PageHeader';

const renderActions = (actions) =>
  actions.map(
    ({ createdDate, actions }) =>
      <div key={createdDate}>
        <h2>{moment(createdDate).format('MMM Do YYYY')}</h2>
        <ListGroup>
          {actions.map(({ skill }) => <ListGroupItem key={skill.name} >{skill.name}</ListGroupItem>)}
        </ListGroup>
      </div>
);

class FeedbackPageComponent extends React.Component {
  componentDidMount() {
    this.props.actions.retrieveActions(this.props.userId, ACTION_TYPES.FEEDBACK);
  }

  render() {
    const { error, actions } = this.props.feedback;

    if (error) {
      return (
        <Grid>
          <Row>
            <Alert bsStyle='danger'>Something went wrong: {error.message}</Alert>
          </Row>
        </Grid>
      );
    }

    return (
      <Grid>
        <PageHeader title='Feedback' />
        { actions ? renderActions(this.props.feedback.actions) : false}
      </Grid>
    )
  }
}

FeedbackPageComponent.propTypes = {};

export const FeedbackPage = connect(
  function mapStateToProps(state) {
    return ({
      userId: state.dashboard.user.id,
      feedback: state.actions.feedback
    });
  },
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(actions, dispatch)
    };
  }
)(FeedbackPageComponent);
