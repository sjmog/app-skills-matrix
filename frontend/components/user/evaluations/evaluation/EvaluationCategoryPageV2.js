import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import R from 'ramda';
import { Grid, Col, Row, Alert } from 'react-bootstrap';
import { Link } from 'react-router';

import * as selectors from '../../../../modules/user'
// import { actions, SKILL_STATUS, EVALUATION_VIEW, EVALUATION_STATUS } from '../../../../modules/user/evaluations';
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

  componentWillReceiveProps() {
    const {  params: { evaluationId }, uiActions, initialisedEvaluation } = this.props;

    if (!initialisedEvaluation || initialisedEvaluation !== evaluationId) {
      uiActions.initEvaluation(evaluationId);
    }
  }

  nextSkill() {};

  prevSkill() {}

  navigatePostSkillUpdate() {}

  updateSkillStatus(evaluationView) {}

  evaluationComplete(evaluationId) {}

  render() {
    return (
      <Grid>
        <Row>
          <h1>{`Subject name: ${this.props.subjectName}`}</h1>
          <h1>{`Evaluation name: ${this.props.evaluationName}`}</h1>
          <h1>{`Current skill: ${this.props.currentSkill ? this.props.currentSkill.name : null}`}</h1>
          <h1>{`Current skill status: ${this.props.currentSkill ? this.props.currentSkill.status.current : null}`}</h1>
          <h1>{`Skill level: ${this.props.currentSkillGroup ? this.props.currentSkillGroup.level : null}`}</h1>
          <h1>{`Skill category: ${this.props.currentSkillGroup ? this.props.currentSkillGroup.category : null}`}</h1>
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
    })
  },
  function mapDispatchToProps(dispatch) {
    return {
      uiActions: bindActionCreators(uiActions, dispatch),
      entityActions: bindActionCreators(entityActions, dispatch)
    };
  }
)(EvaluationPageComponent);
