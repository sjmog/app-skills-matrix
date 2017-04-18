import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Grid, Alert, ListGroup, ListGroupItem } from 'react-bootstrap';

import { actions, ACTION_TYPES } from '../../../modules/user/actions';
import PageHeader from './../../common/PageHeader';
import ActionsList from './ActionsList';

class ObjectivesPageComponent extends React.Component {
  componentDidMount() {
    this.props.actions.retrieveActions(this.props.userId, ACTION_TYPES.OBJECTIVE);
  }

  render() {
    const { error, actions } = this.props.objectives;

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
        <PageHeader title='Objectives' />
        { actions ? <ActionsList actions={actions} /> : false}
      </Grid>
    )
  }
}

ObjectivesPageComponent.propTypes = {
  userId: PropTypes.string.isRequired,
  objectives: PropTypes.object,
};

export const ObjectivesPage = connect(
  function mapStateToProps(state) {
    return ({
      userId: state.dashboard.user.id,
      objectives: state.actions.objective
    });
  },
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(actions, dispatch)
    };
  }
)(ObjectivesPageComponent);
