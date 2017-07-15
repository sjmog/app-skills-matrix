import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Grid, Alert } from 'react-bootstrap';

import { actions, ACTION_TYPES } from '../../../modules/user/actions';
import PageHeader from './../../common/PageHeader';
import ActionsList from './ActionsList';
import SkillDetailsModal from '../../common/matrix/SkillDetailsModal';

class ObjectivesPageComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };

    this.viewSkillDetails = this.viewSkillDetails.bind(this);
    this.hideSkillDetails = this.hideSkillDetails.bind(this);
  }

  componentDidMount() {
    this.props.actions.retrieveActions(this.props.userId, ACTION_TYPES.OBJECTIVE);
  }

  viewSkillDetails(skill) {
    this.setState({
      showModal: true,
      currentSkill: skill,
    });
  }

  hideSkillDetails() {
    this.setState({
      currentSkill: null,
      showModal: false,
    });
  }

  render() {
    const { error, actions, skillBeingEvaluated, updateSkillStatus, canUpdateSkillStatus } = this.props.objectives;

    if (error) {
      return (
        <Grid>
          <Row>
            <Alert bsStyle="danger">Something went wrong: {error.message}</Alert>
          </Row>
        </Grid>
      );
    }

    return (
      <div>
        <Grid>
          <PageHeader title="Objectives" />
          { actions ? <ActionsList
            actions={actions}
            viewSkillDetails={this.viewSkillDetails}
            skillBeingEvaluated={skillBeingEvaluated}
          /> : false}
        </Grid>
        <SkillDetailsModal
          showModal={this.state.showModal}
          onClose={this.hideSkillDetails}
          skill={this.state.currentSkill}
          updateSkillStatus={updateSkillStatus}
          canUpdateSkillStatus={canUpdateSkillStatus}
        />
      </div>
    );
  }
}

ObjectivesPageComponent.propTypes = {
  userId: PropTypes.string.isRequired,
  objectives: PropTypes.object,
  skillBeingEvaluated: PropTypes.number,
  canUpdateSkillStatus: PropTypes.bool,
};

export const ObjectivesPage = connect(
  state => ({
    userId: state.user.userDetails.id,
    objectives: state.actions.objective,
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch),
  }),
)(ObjectivesPageComponent);
