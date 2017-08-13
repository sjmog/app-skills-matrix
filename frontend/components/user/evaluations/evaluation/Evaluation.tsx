import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as R from 'ramda';
import { Grid, Col, Row, Alert } from 'react-bootstrap';

import * as selectors from '../../../../modules/user';
import { actionCreators as evaluationActionCreators, EVALUATION_VIEW, EVALUATION_STATUS } from '../../../../modules/user/evaluations';
import { actionCreators as uiActionCreators } from '../../../../modules/user/evaluation';

import EvaluationHeader from './EvaluationHeader';
import Matrix from '../../matrix/Matrix';
import Skill from './Skill';
import Notes from '../../notes/Notes';

const { SUBJECT, MENTOR, ADMIN } = EVALUATION_VIEW;
const { NEW, SELF_EVALUATION_COMPLETE } = EVALUATION_STATUS;

// TODO: fix types
type Skill = {
  skillUid: number,
  skillGroupId: number,
  level: string,
  category: string,
};

type EvaluationProps = {
  evaluationId: string,
  view: string,
  levels: string[],
  skillGroups?: any,
  status: string,
  updateSkillStatus: (skillId: number) => Promise<void>,
  initialisedEvaluation?: string,
  currentSkill: Skill,
  currentSkillUid?: number,
  currentSkillStatus: {
    current: string,
    previous: string,
  },
  firstCategory: string,
  lastCategory: string,
  firstSkill: Skill,
  lastSkill: Skill,
  erringSkills: string[],
  uiActions: any,
  evalActions: any,
};

class Evaluation extends React.Component<EvaluationProps, any> {
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

  componentWillUnmount() {
    const { evaluationId, uiActions } = this.props;
    uiActions.terminateEvaluation(evaluationId);
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
      currentSkillUid,
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
              isFirstSkill={currentSkillUid === firstSkill.skillUid}
              isLastSkill={currentSkillUid === lastSkill.skillUid}
              postUpdateNavigation={this.postUpdateNavigation}
            />
            <Notes skillUid={currentSkillUid} />
          </Col>
          <Col md={5} className="evaluation-panel evaluation-panel--right">
            <Matrix
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

export default connect(
  (state, props) => {
    const { evaluationId } = props;
    const currentSkill = selectors.getCurrentSkill(state);
    const currentSkillUid = selectors.getCurrentSkillUid(state);
    const skillUidsForEvaluation = selectors.getSkillUids(state, evaluationId);

    return ({
      initialisedEvaluation: selectors.getCurrentEvaluation(state),
      currentSkill,
      currentSkillUid,
      currentSkillStatus: selectors.getSkillStatus(state, currentSkillUid),
      firstCategory: selectors.getFirstCategory(state),
      lastCategory: selectors.getLastCategory(state),
      firstSkill: selectors.getFirstSkill(state),
      lastSkill: selectors.getLastSkill(state),
      erringSkills: selectors.getErringSkills(state, skillUidsForEvaluation),
      skillGroups: selectors.getSkillGroupsWithReversedSkills(state, evaluationId),
    });
  },
  dispatch => ({
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    evalActions: bindActionCreators(evaluationActionCreators, dispatch),
  }),
)(Evaluation);
