import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import R from 'ramda';
import { Grid, Col, Row, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router';

import * as selectors from '../../../../modules/user'
import { actions, SKILL_STATUS, EVALUATION_VIEW, EVALUATION_STATUS } from '../../../../modules/user/evaluations';
const { SUBJECT, MENTOR } = EVALUATION_VIEW;
const { NEW, SELF_EVALUATION_COMPLETE } = EVALUATION_STATUS;
import { actionCreators as uiActionCreators } from '../../../../modules/user/evaluation';
import { actions as entityActions } from '../../../../modules/user/evaluations';

import EvaluationHeader from './EvaluationHeader';
import Matrix from '../../../common/matrix/Matrix';
import Skill from './Skill';

class EvaluationPageComponent extends React.Component {
  constructor(props) {
    super(props);

    this.updateSkillStatus = this.updateSkillStatus.bind(this);
    this.nextSkill = this.nextSkill.bind(this);
    this.prevSkill = this.prevSkill.bind(this);
    this.nextCategory = this.nextCategory.bind(this);
    this.previousCategory = this.previousCategory.bind(this);
    this.evaluationComplete = this.evaluationComplete.bind(this);
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

  nextCategory() {
    const { uiActions, evaluationId } = this.props;
    uiActions.nextCategory(evaluationId);
  }

  previousCategory() {
    const { uiActions, evaluationId } = this.props;
    uiActions.previousCategory(evaluationId);
  }

  evaluationComplete() {
    const { entityActions, evaluationId } = this.props;
    entityActions.evaluationComplete(evaluationId);
  }

  render() {
    const {
      currentSkill,
      skillStatus,
      lastSkill,
      firstSkill,
      evaluationId,
      lastCategory,
      firstCategory,
      skills,
      levels,
      skillGroups,
      view,
      erringSkills
    } = this.props;

    const currentSkillId = R.path(['skillId'], currentSkill);

    if (typeof currentSkillId !== 'number') { // TODO: May want to use init flag.
      return false;
    }


    return (
      <Grid>
        { erringSkills
          ? <Row>
              {erringSkills.map(
                ({ name }) =>
                  <Alert bsStyle='danger' key={name}>
                    {`There was a problem updating a skill: ${name}`}
                  </Alert>
              )}
            </Row>
          : false
        }
        <Row>
          <EvaluationHeader
            evaluationId={evaluationId}
            currentCategory={currentSkill.category}
            isFirstCategory={currentSkill.category === firstCategory}
            isLastCategory={currentSkill.category === lastCategory}
            nextCategory={this.nextCategory}
            previousCategory={this.previousCategory}
            evaluationComplete={this.evaluationComplete}
          />
        </Row>
        <Row>
          <Col md={7} className='evaluation-panel'>
            <Skill
              level={currentSkill.level}
              skill={currentSkill}
              skillStatus={skillStatus}
              updateSkillStatus={this.updateSkillStatus}
              nextSkill={this.nextSkill}
              prevSkill={this.prevSkill}
              isFirstSkill={currentSkillId === firstSkill.skillId}
              isLastSkill={currentSkillId === lastSkill.skillId}
            />
          </Col>
          <Col md={5} className='evaluation-panel evaluation-panel--right'>
            <Matrix
              skillBeingEvaluated={currentSkillId}
              categories={[].concat(currentSkill.category)}
              levels={R.reverse(R.slice(0, levels.indexOf(currentSkill.level) + 1, levels))}
              skillGroups={skillGroups}
              updateSkillStatus={this.updateSkillStatus}
              canUpdateSkillStatus={
                view === SUBJECT && status === NEW
                || view === MENTOR && status === SELF_EVALUATION_COMPLETE
              }
              skills={skills}
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
      firstCategory: selectors.getFirstCategory(state),
      lastCategory: selectors.getLastCategory(state),
      firstSkill: selectors.getFirstSkill(state),
      lastSkill: selectors.getLastSkill(state),
      view: selectors.getView(state, evaluationId),
      levels: selectors.getLevels(state, evaluationId),
      skillGroups: selectors.getSkillGroups(state, evaluationId),
      skills: selectors.getSkills(state, evaluationId),
      erringSkills: selectors.getErringSkills(state, evaluationId),
    })
  },
  function mapDispatchToProps(dispatch) {
    return {
      uiActions: bindActionCreators(uiActionCreators, dispatch),
      entityActions: bindActionCreators(entityActions, dispatch)
    };
  }
)(EvaluationPageComponent);
