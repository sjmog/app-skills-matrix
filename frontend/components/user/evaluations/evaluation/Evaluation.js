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

    this.updateSkillStatus = this.updateSkillStatus.bind(this);
    this.nextSkill = this.nextSkill.bind(this);
    this.prevSkill = this.prevSkill.bind(this);
  }
  componentDidMount() {
    const { evaluationId, fetchStatus, uiActions, initialisedEvaluation } = this.props;

    if ((!initialisedEvaluation || initialisedEvaluation !== evaluationId) && fetchStatus === 'LOADED') {
      uiActions.initEvaluation(evaluationId);
    }
  }

  updateSkillStatus(newSkillStatus) {
    const { entityActions, uiActions, currentSkill: { skillId, skillGroupId }, view, evaluationId } = this.props;

    entityActions.updateSkillStatus(view, evaluationId, skillId, skillGroupId, newSkillStatus)
      .then(() => uiActions.nextUnevaluatedSkill(evaluationId));
  }

  nextSkill() {
    const { uiActions } = this.props;

    uiActions.nextSkill();
  }

  prevSkill() {
    const { uiActions } = this.props;

    uiActions.prevSkill();
  }

  evaluationComplete(evaluationId) {}

  render() {
    const { evaluationId, currentSkill, firstCategory, lastCategory, view, currentSkillStatus, skillStatus  } = this.props;

    const currentSkillId = R.path(['skillId'], currentSkill);

    if (!currentSkillId) { // TODO: May want to use init flag.
      return false;
    }

    return (
      <Grid>
        <Row>
          <Col md={7} className='evaluation-panel'>
            <Skill
              level={currentSkill.level}
              skill={currentSkill}
              skillStatus={skillStatus}
              updateSkillStatus={this.updateSkillStatus}
              nextSkill={this.nextSkill}
              prevSkill={this.prevSkill}
              isFirstSkill={false}
              isLastSkill={false}
            />
          </Col>
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
      skillStatus: selectors.getSkillStatus(state, currentSkill.skillId, evaluationId),
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
