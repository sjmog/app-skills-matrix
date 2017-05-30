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

  updateSkillStatus(view, evaluationId, currentSkillId, currentSkillGroupId, newSkillStatus) {
    const { entityActions: { updateSkillStatus }, uiActions: { moveToNextSkill } } = this.props;
    // TODO: Handle errors properly.
    updateSkillStatus(view, evaluationId, currentSkillId, currentSkillGroupId, newSkillStatus)
      .then(() => moveToNextSkill(currentSkillId, evaluationId));
  }

  evaluationComplete(evaluationId) {}

  render() {
    const { params: { evaluationId }, currentSkill, view  } = this.props;

    const currentSkillId = R.path(['skillId'], currentSkill);
    const currentSkillGroupId = R.path(['skillGroupId'], currentSkill);

    return (
      <Grid>
        <Row>
          <h4>{`Subject name: ${this.props.subjectName}`}</h4>
          <h4>{`Evaluation name: ${this.props.evaluationName}`}</h4>
          <h4>{`Current skill: ${this.props.currentSkill ? this.props.currentSkill.name : null}`}</h4>
          <h4>{`Current skill status: ${this.props.currentSkillStatus ? this.props.currentSkillStatus : null}`}</h4>
          <h4>{`Skill level: ${this.props.currentSkill ? this.props.currentSkill.level : null}`}</h4>
          <h4>{`Skill category: ${this.props.currentSkill ? this.props.currentSkill.category : null}`}</h4>
          <Button
            onClick={() => this.updateSkillStatus(view, evaluationId, currentSkillId, currentSkillGroupId, SKILL_STATUS.ATTAINED)}>
            Attained
          </Button>
          <Button
            onClick={() => this.updateSkillStatus(view, evaluationId, currentSkillId, currentSkillGroupId, SKILL_STATUS.NOT_ATTAINED)}>
            Not attained
          </Button>
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
    const currentSkill = selectors.getCurrentSkill(state);

    return ({
      initialisedEvaluation: selectors.getCurrentEvaluation(state),
      subjectName: selectors.getSubjectName(state, evaluationId),
      evaluationName: selectors.getEvaluationName(state, evaluationId),
      fetchStatus: selectors.getEvaluationFetchStatus(state, evaluationId),
      currentSkill,
      currentSkillStatus: selectors.getCurrentSkillStatus(state, currentSkill.skillId, evaluationId),
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
