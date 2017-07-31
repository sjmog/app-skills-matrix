import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Grid, Alert } from 'react-bootstrap';

import * as selectors from '../../../modules/user';
import { actions, ACTION_TYPES } from '../../../modules/user/actions';
import PageHeader from '../../common/PageHeader';
import ActionsList from './ActionsList';

// TODO add types
class EvalutionObjectivesPageComponent extends React.Component<any, any> {
  componentDidMount() {
    this.props.actions.retrieveActions(this.props.userId, ACTION_TYPES.OBJECTIVE);
  }

  render() {
    const { retrieved, error, objectives } = this.props;

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
        <PageHeader title="Objectives" />
        { objectives ? < ActionsList actions={objectives} /> : false}
      </Grid>
    );
  }
}

export const EvaluationObjectivesPage = connect(
  (state, { params }) => {
    const { evaluationId, userId } = params;
    const retrieved = selectors.getObjectivesRetrievedStatus(state);
    const error = selectors.getObjectivesError(state);

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
      objectives: selectors.geObjectivesForEvaluation(state, evaluationId),
      evaluationId,
    });
  },
  dispatch => ({
    actions: bindActionCreators(actions, dispatch),
  }),
)(EvalutionObjectivesPageComponent);
