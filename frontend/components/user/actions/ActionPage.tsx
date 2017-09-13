import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Row, Alert, PageHeader } from 'react-bootstrap';
import * as moment from 'moment';
import * as R from 'ramda';

import * as selectors from '../../../modules/user';
import {
  actionCreators as evaluationsActionCreators,
  EVALUATION_FETCH_STATUS,
  SKILL_STATUS,
  EVALUATION_VIEW,
} from '../../../modules/user/evaluations';
const { SUBJECT } = EVALUATION_VIEW;

import ActionsList from './ActionsList';
import SkillDetailsModal from '../../common/SkillDetailsModal';

const toTitle = str => (R.is(String, str) && str.length > 0 ? R.over(R.lensIndex(0), R.toUpper)(str) : '');

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
  date: Date,
  view: string,
  subject: string,
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
    loadEvaluation(nextProps);
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
    const { error, actionSkillUids, params: { evaluationId, actionType }, fetchStatus, date, view, subject } = this.props;

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

    if (!actionTypeToStatusMapping[actionType]) {
      return false;
    }

    return (
      <div>
        <Grid>
          {
            view === SUBJECT
              ? <PageHeader>{toTitle(actionType)} <small>{moment(date).format('ll')}</small></PageHeader>
              : <PageHeader>{toTitle(actionType)} <small>{subject} - {moment(date).format('ll')}</small></PageHeader>
          }
          {
            actionSkillUids
              ? <ActionsList actionSkillUids={actionSkillUids} viewSkillDetails={this.viewSkillDetails} />
              : false
          }
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
      date: selectors.getEvaluationDate(state, evalId),
      subject: selectors.getSubjectName(state, evalId),
    });
  },
  dispatch => ({
    evalActions: bindActionCreators(evaluationsActionCreators, dispatch),
  }),
)(ActionPageComponent);
