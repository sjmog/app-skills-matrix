import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Row, Alert, PageHeader } from 'react-bootstrap';

import * as selectors from '../../../modules/user';
import { actionCreators as evaluationsActionCreators, EVALUATION_FETCH_STATUS, SKILL_STATUS } from '../../../modules/user/evaluations';

import ActionsList from './ActionsList';
import SkillDetailsModal from '../../common/SkillDetailsModal';

const actionTypeToStatusMapping = {
  feedback: SKILL_STATUS.FEEDBACK,
  objectives: SKILL_STATUS.OBJECTIVE,
};

type ActionPageComponentProps = {
  error?: { message?: string },
  params: {
    evaluationId: string,
    actionType: string,
  },
  fetchStatus: boolean,
  evalActions: typeof evaluationsActionCreators,
  actionSkillUids?: string[],
};

const loadEvaluation = ({ params: { evaluationId }, fetchStatus, evalActions }) => {
  if (!fetchStatus) {
    evalActions.retrieveEvaluation(evaluationId);
  }
};

class ActionPageComponent extends React.Component<ActionPageComponentProps, any> {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };

    this.viewSkillDetails = this.viewSkillDetails.bind(this);
    this.hideSkillDetails = this.hideSkillDetails.bind(this);
  }

  componentDidMount() {
    loadEvaluation(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.evaluationId !== nextProps.params.evaluationId) {
      loadEvaluation(nextProps);
    }
  }

  viewSkillDetails(skillUid) {
    this.setState({
      showModal: true,
      currentSkill: skillUid,
    });
  }

  hideSkillDetails() {
    this.setState({
      currentSkill: null,
      showModal: false,
    });
  }

  render() {
    const { error, actionSkillUids, params: { evaluationId }, fetchStatus } = this.props;

    if (error) {
      return (
        <Grid>
          <Row>
            <Alert bsStyle="danger">Something went wrong: {error.message}</Alert>
          </Row>
        </Grid>
      );
    }

    if (fetchStatus !== EVALUATION_FETCH_STATUS.LOADED) {
      return false;
    }

    return (
      <div>
        <Grid>
          <PageHeader title={this.props.params.actionType} />
          { actionSkillUids ? <ActionsList actionSkillUids={actionSkillUids} viewSkillDetails={this.viewSkillDetails} /> : false }
        </Grid>
        <SkillDetailsModal
          evaluationId={evaluationId}
          skillUid={this.state.currentSkill}
          showModal={this.state.showModal}
          onClose={this.hideSkillDetails}
        />
      </div>
    );
  }
}

export const ActionPage = connect(
  (state, props) => {
    const evalId = props.params.evaluationId;
    const { actionType } = props.params;
    const skillUids = selectors.getSkillUids(state, evalId);

    return ({
      error: selectors.getError(state, evalId),
      fetchStatus: selectors.getEvaluationFetchStatus(state, evalId),
      actionSkillUids: selectors.getSkillsWithCurrentStatus(state, actionTypeToStatusMapping[actionType], skillUids),
      view: selectors.getView(state, evalId),
    });
  },
  dispatch => ({
    evalActions: bindActionCreators(evaluationsActionCreators, dispatch),
  }),
)(ActionPageComponent);
