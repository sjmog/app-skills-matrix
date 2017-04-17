import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Grid, Alert, ListGroup, ListGroupItem } from 'react-bootstrap';

import * as selectors from '../../../modules/user';
import { actions, ACTION_TYPES } from '../../../modules/user/actions';
import PageHeader from './../../common/PageHeader';
import ActionsList from './ActionsList';

class EvalutionObjectivesPageComponent extends React.Component {
  componentDidMount() {
    if (!this.props.retrieved) {
      this.props.actions.retrieveActions(this.props.userId, ACTION_TYPES.OBJECTIVE);
    }
  }

  render() {
    const { retrieved, error, objectives } = this.props;

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
        <PageHeader title='Objectives' />
        { objectives ? <ActionsList actions={objectives} />  : false}
      </Grid>
    )
  }
}

EvalutionObjectivesPageComponent.propTypes = {};

export const EvaluationObjectivesPage = connect(
  function mapStateToProps(state, { params }) {
    const { evaluationId } = params;
    const retrieved = selectors.getObjectivesRetrievedStatus(state);
    const error = selectors.getObjectivesError(state);

    if (!retrieved || error) {
      return ({
        userId: state.dashboard.user.id,
        error,
        retrieved,
      })
    }

    return ({
      retrieved,
      objectives: selectors.geObjectivesForEvaluation(state, evaluationId),
      evaluationId
    });
  },
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(actions, dispatch)
    };
  }
)(EvalutionObjectivesPageComponent);
