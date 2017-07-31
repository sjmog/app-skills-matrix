import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Grid, Alert } from 'react-bootstrap';

import * as selectors from '../../../modules/user';
import { actions, ACTION_TYPES } from '../../../modules/user/actions';
import PageHeader from '../../common/PageHeader';
import ActionsList from './ActionsList';

// TODO: add types
class EvaluationFeedbackPageComponent extends React.Component<any, any> {
  componentDidMount() {
    this.props.actions.retrieveActions(this.props.userId, ACTION_TYPES.FEEDBACK);
  }

  render() {
    const { retrieved, error, feedback } = this.props;

    if (error) {
      return (
        <Grid>
          <Row>
            <Alert bsStyle="danger">Something went wrong: {error.message}</Alert>
          </Row>
        </Grid>
      );
    }

    if (!retrieved) {
      return false;
    }

    return (
      <Grid>
        <PageHeader title="Feedback" />
        { feedback ? <ActionsList actions={feedback} /> : false}
      </Grid>
    );
  }
}

export const EvaluationFeedbackPage = connect(
  (state, { params }) => {
    const { evaluationId, userId } = params;
    const retrieved = selectors.getFeedbackRetrievedStatus(state);
    const error = selectors.getFeedbackError(state);

    if (!retrieved || error) {
      return ({
        userId,
        error,
        retrieved,
      });
    }

    return ({
      userId,
      retrieved,
      feedback: selectors.getFeedbackForEvaluation(state, evaluationId),
      evaluationId,
    });
  },
  dispatch => ({
    actions: bindActionCreators(actions, dispatch),
  }),
)(EvaluationFeedbackPageComponent);
