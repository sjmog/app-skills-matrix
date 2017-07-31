import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import R from 'ramda';
import { Grid, Col, Row, Alert } from 'react-bootstrap';

import * as selectors from '../../../../modules/user';
import { actionCreators as evaluationActionCreators, EVALUATION_VIEW, EVALUATION_STATUS } from '../../../../modules/user/evaluations';
import { actionCreators as uiActionCreators } from '../../../../modules/user/evaluation';

import EvaluationHeader from './EvaluationHeader';
import Matrix from '../../../common/matrix/Matrix';
import Skill from './Skill';

const { SUBJECT, MENTOR, ADMIN } = EVALUATION_VIEW;
const { NEW, SELF_EVALUATION_COMPLETE } = EVALUATION_STATUS;

class Evaluation extends React.Component {
  constructor(props) {
    super(props);

    this.nextSkill = this.nextSkill.bind(this);
    this.prevSkill = this.prevSkill.bind(this);
    this.nextCategory = this.nextCategory.bind(this);
    this.previousCategory = this.previousCategory.bind(this);
    this.evaluationComplete = this.evaluationComplete.bind(this);
    this.postUpdateNavigation = this.postUpdateNavigation.bind(this);
  }

  componentDidMount() {
    const { evaluationId, uiActions, initialisedEvaluation } = this.props;

    if (!initialisedEvaluation || initialisedEvaluation !== evaluationId) {
      uiActions.initEvaluation(evaluationId);
    }
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
    const { evalActions, evaluationId } = this.props;
    evalActions.evaluationComplete(evaluationId);
  }

  postUpdateNavigation() {
    const { uiActions, evaluationId } = this.props;
    uiActions.nextUnevaluatedSkill(evaluationId);
  }

  render() {
    const {
      levels,
      skillGroups,
      view,
      status,
      initialisedEvaluation,
      updateSkillStatus,
      currentSkill,
      currentSkillId,
      currentSkillStatus,
      lastSkill,
      firstSkill,
      evaluationId,
      lastCategory,
      firstCategory,
      erringSkills,
    } = this.props;

    if (!initialisedEvaluation || initialisedEvaluation !== evaluationId) {
      return false;
    }
    return (
      <Grid>
        { erringSkills
          ? <Row>
            {
              erringSkills.map(name =>
                (<Alert bsStyle="danger" key={name}>{`There was a problem updating a skill: ${name}`}</Alert>))
            }
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
          <Col md={7} className="evaluation-panel">
            <Skill
              level={currentSkill.level}
              skill={currentSkill}
              skillStatus={currentSkillStatus}
              updateSkillStatus={updateSkillStatus}
              nextSkill={this.nextSkill}
              prevSkill={this.prevSkill}
              isFirstSkill={currentSkillId === firstSkill.skillId}
              isLastSkill={currentSkillId === lastSkill.skillId}
              postUpdateNavigation={this.postUpdateNavigation}
            />
          </Col>
          <Col md={5} className="evaluation-panel evaluation-panel--right">
            <Matrix
              skillBeingEvaluated={currentSkillId}
              categories={[].concat(currentSkill.category)}
              levels={R.slice(levels.indexOf(currentSkill.level), Infinity, levels)}
              skillGroups={skillGroups}
              updateSkillStatus={updateSkillStatus}
              canUpdateSkillStatus={
                view === ADMIN
                || (view === SUBJECT && status === NEW)
                || (view === MENTOR && status === SELF_EVALUATION_COMPLETE)
              }
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

const skillShape = PropTypes.shape({
  skillId: PropTypes.string.isRequired,
  skillGroupId: PropTypes.number.isRequired,
  level: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
});

Evaluation.propTypes = {
  evaluationId: PropTypes.string.isRequired,
  view: PropTypes.string.isRequired,
  levels: PropTypes.array.isRequired,
  skillGroups: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
  updateSkillStatus: PropTypes.func.isRequired,
  initialisedEvaluation: PropTypes.string,
  currentSkill: skillShape,
  currentSkillId: PropTypes.string,
  currentSkillStatus: PropTypes.shape({
    current: PropTypes.string,
    previous: PropTypes.string,
  }),
  firstCategory: PropTypes.string,
  lastCategory: PropTypes.string,
  firstSkill: skillShape,
  lastSkill: skillShape,
  erringSkills: PropTypes.arrayOf(PropTypes.string),
};

export default connect(
  (state, props) => {
    const { evaluationId } = props;
    const currentSkill = selectors.getCurrentSkill(state);
    const currentSkillId = selectors.getCurrentSkillId(state);
    const skillIdsForEvaluation = selectors.getSkillIds(state, evaluationId);

    return ({
      initialisedEvaluation: selectors.getCurrentEvaluation(state),
      currentSkill,
      currentSkillId,
      currentSkillStatus: selectors.getSkillStatus(state, currentSkillId),
      firstCategory: selectors.getFirstCategory(state),
      lastCategory: selectors.getLastCategory(state),
      firstSkill: selectors.getFirstSkill(state),
      lastSkill: selectors.getLastSkill(state),
      erringSkills: selectors.getErringSkills(state, skillIdsForEvaluation),
      skillGroups: selectors.getSkillGroupsWithReversedSkills(state, evaluationId),
    });
  },
  dispatch => ({
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    evalActions: bindActionCreators(evaluationActionCreators, dispatch),
  }),
)(Evaluation);
