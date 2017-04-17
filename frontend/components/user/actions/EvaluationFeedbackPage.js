import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Grid, Alert, ListGroup, ListGroupItem } from 'react-bootstrap';

import * as selectors from '../../../modules/user';
import { actions, ACTION_TYPES } from '../../../modules/user/actions';
import PageHeader from './../../common/PageHeader';
import ActionsList from './ActionsList';

class EvaluationFeedbackPageComponent extends React.Component {
  componentDidMount() {
    this.props.actions.retrieveActions(this.props.userId, ACTION_TYPES.FEEDBACK);
  }

  render() {
    const { retrieved, error, feedback } = this.props;

    if (error) {
      return (
        <Grid>
          <Row>
            <Alert bsStyle='danger'>Something went wrong: {error.message}</Alert>
          </Row>
        </Grid>
      );
    }

    if (!retrieved) {
      return false;
    }

    return (
      <Grid>
        <PageHeader title='Feedback' />
        { feedback ? <ActionsList actions={feedback} />  : false}
      </Grid>
    )
  }
}

EvaluationFeedbackPageComponent.propTypes = {};

export const EvaluationFeedbackPage = connect(
  function mapStateToProps(state, { params }) {
    const { evaluationId, userId } = params;
    const retrieved = selectors.getFeedbackRetrievedStatus(state);
    const error = selectors.getFeedbackError(state);

    if (!retrieved || error) {
      return ({
        userId,
        error,
        retrieved,
      })
    }

    return ({
      userId,
      retrieved,
      feedback: selectors.getFeedbackForEvaluation(state, evaluationId),
      evaluationId
    });
  },
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(actions, dispatch)
    };
  }
)(EvaluationFeedbackPageComponent);
