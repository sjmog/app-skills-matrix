import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Col, Row, Alert } from 'react-bootstrap';

import * as selectors from '../../../../modules/user';
import { actionCreators as evaluationActionCreators } from '../../../../modules/user/evaluations';
import { actionCreators as uiActionCreators } from '../../../../modules/user/evaluation';

import EvaluationHeader from './EvaluationHeader';
import Progress from './Progress';
import Skill from './Skill';

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
  categories: string[],
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

const skillErrors = erringSkills => (
  <Row>
    {
      erringSkills.map(name =>
        (<Alert bsStyle="danger" key={name}>{`There was a problem updating a skill: ${name}`}</Alert>))
    }
  </Row>
);

class Evaluation extends React.Component<EvaluationProps, any> {
  constructor(props) {
    super(props);

    this.nextCategory = this.nextCategory.bind(this);
    this.evaluationComplete = this.evaluationComplete.bind(this);
    this.nextUnevaluatedSkill = this.nextUnevaluatedSkill.bind(this);
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

  nextCategory() {
    const { uiActions, evaluationId } = this.props;
    uiActions.nextCategory(evaluationId);
  }

  evaluationComplete() {
    const { evalActions, evaluationId } = this.props;
    evalActions.evaluationComplete(evaluationId);
  }

  nextUnevaluatedSkill() {
    const { uiActions, evaluationId } = this.props;
    uiActions.nextUnevaluatedSkill(evaluationId);
  }

  render() {
    const {
      levels,
      categories,
      skillGroups,
      initialisedEvaluation,
      updateSkillStatus,
      currentSkill,
      currentSkillUid,
      currentSkillStatus,
      lastSkill,
      evaluationId,
      lastCategory,
      erringSkills,
    } = this.props;

    if (!initialisedEvaluation || initialisedEvaluation !== evaluationId) {
      return false;
    }
    return (
      <Grid>
        {erringSkills && erringSkills.length > 0 ? skillErrors(erringSkills) : false}
        <Row>
          <EvaluationHeader
            evaluationId={evaluationId}
            currentCategory={currentSkill.category}
            isLastCategory={currentSkill.category === lastCategory}
            nextCategory={this.nextCategory}
            evaluationComplete={this.evaluationComplete}
          />
        </Row>
        <Row>
          <Col md={8} className="evaluation-panel">
            <Skill
              level={currentSkill.level}
              skill={currentSkill}
              skillStatus={currentSkillStatus}
              updateSkillStatus={updateSkillStatus}
              nextUnevaluatedSkill={this.nextUnevaluatedSkill}
              isLastSkill={currentSkillUid === lastSkill.skillUid}
            />
          </Col>
          <Col md={4} className="evaluation-panel evaluation-panel--right">
            <Progress
              categories={categories}
              levels={levels}
              skillGroups={skillGroups}
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
      lastSkill: selectors.getLastSkill(state),
      lastCategory: selectors.getLastCategory(state),
      erringSkills: selectors.getErringSkills(state, skillUidsForEvaluation),
      skillGroups: selectors.getSkillGroupsWithReversedSkills(state, evaluationId),
    });
  },
  dispatch => ({
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    evalActions: bindActionCreators(evaluationActionCreators, dispatch),
  }),
)(Evaluation);
