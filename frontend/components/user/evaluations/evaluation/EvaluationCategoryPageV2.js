import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import R from 'ramda';
import { Grid, Col, Row, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router';

import * as selectors from '../../../../modules/user'
import { actions, SKILL_STATUS } from '../../../../modules/user/evaluations';
import { actions as uiActions } from '../../../../modules/user/evaluation';
import { actions as entityActions } from '../../../../modules/user/evaluations';
// const { SUBJECT, MENTOR } = EVALUATION_VIEW;
// const { NEW, SELF_EVALUATION_COMPLETE } = EVALUATION_STATUS;

import CategoryPageHeader from './CategoryPageHeader';
import Matrix from '../../../common/matrix/Matrix';
import Skill from './Skill';

class EvaluationPageComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { params: { evaluationId }, fetchStatus, entityActions } = this.props;
    if (!fetchStatus) {
      entityActions.retrieveEvaluation(evaluationId)
    }
  }

  componentWillReceiveProps(nextProps) {
    const {  params: { evaluationId }, fetchStatus, uiActions, initialisedEvaluation } = nextProps;

    if ((!initialisedEvaluation || initialisedEvaluation !== evaluationId) && fetchStatus === 'LOADED') {
      uiActions.initEvaluation(evaluationId);
    }
  }

  nextSkill() {};

  prevSkill() {}

  navigatePostSkillUpdate() {}

  updateSkillStatus(evaluationView) {}

  evaluationComplete(evaluationId) {}

  render() {
    const { updateSkillStatus } = this.props.entityActions;
    const { params: { evaluationId }, currentSkill, currentSkillGroup, view  } = this.props;
    const currentSkillId = R.path(['id'], currentSkill);
    const currentSkillGroupId = R.path(['id'], currentSkillGroup);

    return (
      <Grid>
        <Row>
          <h4>{`Subject name: ${this.props.subjectName}`}</h4>
          <h4>{`Evaluation name: ${this.props.evaluationName}`}</h4>
          <h4>{`Current skill: ${this.props.currentSkill ? this.props.currentSkill.name : null}`}</h4>
          <h4>{`Current skill status: ${this.props.currentSkill ? this.props.currentSkill.status.current : null}`}</h4>
          <h4>{`Skill level: ${this.props.currentSkillGroup ? this.props.currentSkillGroup.level : null}`}</h4>
          <h4>{`Skill category: ${this.props.currentSkillGroup ? this.props.currentSkillGroup.category : null}`}</h4>
          <Button onClick={() => updateSkillStatus(view, evaluationId, currentSkillId, currentSkillGroupId, SKILL_STATUS.ATTAINED)}>Attained</Button>
          <Button onClick={() => updateSkillStatus(view, evaluationId, currentSkillId, currentSkillGroupId, SKILL_STATUS.NOT_ATTAINED)}>Not attained</Button>
        </Row>
      </Grid>
    )
  }
}

EvaluationPageComponent.propTypes = {
  params: PropTypes.shape({
    evaluationId: PropTypes.string.isRequired
  }),
  template: PropTypes.shape({
    levels: PropTypes.array
  }),
  skills: PropTypes.object,
  skillGroups: PropTypes.object,
  skillsInCategory: PropTypes.array,
};

export const EvaluationPage = connect(
  function mapStateToProps(state, { params: { evaluationId } }) {
    const { skillId, skillGroupId } = selectors.getCurrentSkill(state);

    return ({
      initialisedEvaluation: selectors.getCurrentEvaluation(state),
      subjectName: selectors.getSubjectName(state, evaluationId),
      evaluationName: selectors.getEvaluationName(state, evaluationId),
      fetchStatus: selectors.getEvaluationFetchStatus(state, evaluationId),
      currentSkill: selectors.getSkill(state, skillId, evaluationId),
      currentSkillGroup: selectors.getSkillGroup(state, skillGroupId, evaluationId),
      view: selectors.getView(state, evaluationId),
    })
  },
  function mapDispatchToProps(dispatch) {
    return {
      uiActions: bindActionCreators(uiActions, dispatch),
      entityActions: bindActionCreators(entityActions, dispatch)
    };
  }
)(EvaluationPageComponent);
