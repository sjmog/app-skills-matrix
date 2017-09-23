import * as React from 'react';
import { Panel, ButtonGroup, Button, Glyphicon, Label, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { default as AnimateOnChange } from 'react-animate-on-change';

import { SKILL_STATUS } from '../../../../modules/user/evaluations';

import SkillActions from '../../../common/SkillActions';
import SkillBody from './SkillBody';
import Notes from '../../notes/Notes';
import '../evaluation.scss';

type SkillProps = {
  evaluationId: string,
  level: string,
  skill: PaginatedEvaluationSkill,
  skillStatus: {
    current: string,
    previous: string,
  },
  isLastSkill: boolean,
  updateSkillStatus: (skillId: number, status: string, skillUid: string) => void,
  nextUnevaluatedSkill: () => void,
};

const newSkillTooltip = (<Tooltip>This skill has been added since your last evaluation</Tooltip>);

class Skill extends React.Component<SkillProps, any> {
  constructor(props) {
    super(props);

    this.state = { fadeIn: false };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.skill.skillUid !== nextProps.skill.skillUid) {
      this.setState({ fadeIn: true });
    } else {
      this.setState({ fadeIn: false });
    }
  }

  render() {
    const { evaluationId, skill, skillStatus, updateSkillStatus, nextUnevaluatedSkill, isLastSkill } = this.props;
    const { name, skillUid, id, criteria, questions } = skill;

    return (
      <AnimateOnChange
        baseClassName="skill"
        animationClassName="skill--fadeIn"
        animate={this.state.fadeIn}>
        <Panel key={skillUid}>
          <h4 className="skill-header__title">
            {
              skillStatus.previous === SKILL_STATUS.NEW
                ? <OverlayTrigger placement="bottom" overlay={newSkillTooltip}><Label bsStyle="info">New skill</Label></OverlayTrigger>
                : null
            }
            {`  ${name}`}
          </h4>
          <SkillBody
            criteria={criteria}
            questions={questions}
          />
          <SkillActions
            skillStatus={skillStatus}
            onAttained={() => updateSkillStatus(id, SKILL_STATUS.ATTAINED, skillUid)}
            onNotAttained={() => updateSkillStatus(id, SKILL_STATUS.NOT_ATTAINED, skillUid)}
            onFeedbackRequest={() => updateSkillStatus(id, SKILL_STATUS.FEEDBACK, skillUid)}
            onSetObjective={() => updateSkillStatus(id, SKILL_STATUS.OBJECTIVE, skillUid)}
          />
          <ButtonGroup className="skill__next-skill">
            <Button
              bsStyle="primary"
              disabled={isLastSkill || !skillStatus.current}
              onClick={() => nextUnevaluatedSkill()}
            >
              <strong>Next</strong>
              {' '}
              <Glyphicon glyph="chevron-right"/>
            </Button>
          </ButtonGroup>
          <Notes evaluationId={evaluationId} skillId={id} skillUid={skillUid}/>
        </Panel>
      </AnimateOnChange>
    );
  }
}

export default Skill;
