import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Col, Row, Alert } from 'react-bootstrap';

import * as selectors from '../../../../modules/user';
import { actionCreators as evaluationActionCreators } from '../../../../modules/user/evaluations';
import { actionCreators as uiActionCreators } from '../../../../modules/user/evaluation';

import EvaluationHeader from './EvaluationHeader';
import NavMatrix from './NavMatrix/NavMatrix';
import Skill from './Skill';

type EvaluationProps = {
  evaluationId: string,
  view: string,
  levels: string[],
  categories: string[],
  skillGroups: SkillGroup[],
  status: string,
  updateSkillStatus: (skillId: number) => Promise<void>,
  initialisedEvaluation?: string,
  currentSkill: PaginatedEvaluationSkill,
  currentSkillUid?: string,
  currentSkillStatus: {
    current: string,
    previous: string,
  },
  firstCategory: string,
  lastCategory: string,
  firstSkill: PaginatedEvaluationSkill,
  lastSkill: PaginatedEvaluationSkill,
  erringSkills: string[],
  uiActions: typeof uiActionCreators,
  evalActions: typeof evaluationActionCreators,
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
    const { uiActions } = this.props;
    uiActions.terminateEvaluation();
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
              evaluationId={evaluationId}
              level={currentSkill.level}
              skill={currentSkill}
              skillStatus={currentSkillStatus}
              updateSkillStatus={updateSkillStatus}
              nextUnevaluatedSkill={this.nextUnevaluatedSkill}
              isLastSkill={currentSkillUid === lastSkill.skillUid}
            />
          </Col>
          <Col md={4} className="evaluation-panel evaluation-panel--right">
            <NavMatrix
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
      skillGroups: selectors.getSkillGroups(state, evaluationId),
    });
  },
  dispatch => ({
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    evalActions: bindActionCreators(evaluationActionCreators, dispatch),
  }),
)(Evaluation);
