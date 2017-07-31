import * as React from 'react';
import { Panel, Label, ButtonGroup, Button, Glyphicon } from 'react-bootstrap';

import { SKILL_STATUS } from '../../../../modules/user/evaluations';

import SkillActions from '../../../common/SkillActions';
import SkillBody from './SkillBody';
import '../evaluation.scss';

// todo: fix types
type SkillProps = {
  level: string,
  skill: any,
  skillStatus: {
    current: string,
    previous: string,
  },
  updateSkillStatus: (skillId: number, status: string) => Promise<void>,
  postUpdateNavigation: () => void,
  prevSkill: (skillId: number) => void,
  nextSkill: (skillId: number) => void,
  isFirstSkill: boolean,
  isLastSkill: boolean,
};

const Skill = ({ level, skill, skillStatus, updateSkillStatus, postUpdateNavigation, prevSkill, nextSkill, isFirstSkill, isLastSkill }: SkillProps) => {
  const { name, skillId, criteria, questions } = skill;

  return (
    <div>
      <Panel
        key={skillId}
        header={
          <div className="skill-header">
            <h4 className="skill-header__title">{name}</h4>
            <Label className="skill-header__label" bsStyle="info">{level}</Label>
          </div>
        }
      >
        <SkillBody criteria={criteria} questions={questions} />
        <SkillActions
          skillStatus={skillStatus}
          onAttained={() => updateSkillStatus(skillId, SKILL_STATUS.ATTAINED).then(() => postUpdateNavigation())}
          onNotAttained={() => updateSkillStatus(skillId, SKILL_STATUS.NOT_ATTAINED).then(() => postUpdateNavigation())}
          onFeedbackRequest={() => updateSkillStatus(skillId, SKILL_STATUS.FEEDBACK).then(() => postUpdateNavigation())}
          onSetObjective={() => updateSkillStatus(skillId, SKILL_STATUS.OBJECTIVE).then(() => postUpdateNavigation())}
        />
      </Panel>
      <ButtonGroup className="pull-right">
        <Button
          disabled={isFirstSkill}
          onClick={() => prevSkill(skillId)}
        >
          <Glyphicon glyph="chevron-left" />
          Previous skill
        </Button>
        <Button
          disabled={isLastSkill}
          onClick={() => nextSkill(skillId)}
        >
          Next skill
          <Glyphicon glyph="chevron-right" />
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default Skill;
