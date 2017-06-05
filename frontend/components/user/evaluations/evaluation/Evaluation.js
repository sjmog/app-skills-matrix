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
  componentDidMount() {
    const { evaluationId, fetchStatus, uiActions, initialisedEvaluation } = this.props;

    if ((!initialisedEvaluation || initialisedEvaluation !== evaluationId) && fetchStatus === 'LOADED') {
      uiActions.initEvaluation(evaluationId);
    }
  }

  updateSkillStatus(view, evaluationId, currentSkillId, currentSkillGroupId, newSkillStatus) {
    const { entityActions: { updateSkillStatus }, uiActions: { nextSkill } } = this.props;

    // TODO: Handle errors properly.
    updateSkillStatus(view, evaluationId, currentSkillId, currentSkillGroupId, newSkillStatus)
      .then(() => nextSkill(evaluationId));
  }

  evaluationComplete(evaluationId) {
  }

  render() {
    const { evaluationId, currentSkill, firstCategory, lastCategory, view  } = this.props;

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
          <Row>
            <Button
              onClick={() => this.updateSkillStatus(view, evaluationId, currentSkillId, currentSkillGroupId, SKILL_STATUS.ATTAINED)}>
              Attained
            </Button>
            <Button
              onClick={() => this.updateSkillStatus(view, evaluationId, currentSkillId, currentSkillGroupId, SKILL_STATUS.NOT_ATTAINED)}>
              Not attained
            </Button>
          </Row>
          <Row>
            <Button
              disabled={currentSkill.category === firstCategory}
              onClick={() => this.props.uiActions.previousCategory(evaluationId)}>
              Previous category
            </Button>
            <Button
              disabled={currentSkill.category === lastCategory}
              onClick={() => this.props.uiActions.nextCategory(evaluationId)}>
              Next category
            </Button>
          </Row>
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

export default connect(
  function mapStateToProps(state, props) {
    const { evaluationId } = props;
    const currentSkill = selectors.getCurrentSkill(state);
    // TODO: May want to move this to EvaluationPage.
    return ({
      evaluationId,
      initialisedEvaluation: selectors.getCurrentEvaluation(state),
      subjectName: selectors.getSubjectName(state, evaluationId),
      evaluationName: selectors.getEvaluationName(state, evaluationId),
      fetchStatus: selectors.getEvaluationFetchStatus(state, evaluationId), // TODO: Consider getting rid of this
      currentSkill,
      currentSkillStatus: selectors.getCurrentSkillStatus(state, currentSkill.skillId, evaluationId),
      firstCategory: selectors.firstCategory(state), // TODO: Add 'get' to this.
      lastCategory: selectors.getLastCategory(state),
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
