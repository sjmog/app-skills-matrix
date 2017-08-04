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
  updateSkillStatus: (skillId: number, status: string, skillUid: string) => Promise<void>,
  postUpdateNavigation: () => void,
  prevSkill: (skillId: number) => void,
  nextSkill: (skillId: number) => void,
  isFirstSkill: boolean,
  isLastSkill: boolean,
};

const Skill = ({ level, skill, skillStatus, updateSkillStatus, postUpdateNavigation, prevSkill, nextSkill, isFirstSkill, isLastSkill }: SkillProps) => {
  const { name, skillUid, id, criteria, questions } = skill;

  return (
    <div>
      <Panel
        key={skillUid}
        header={
          <div className="skill-header">
            <h4 className="skill-header__title">{name}</h4>
            <Label className="skill-header__label" bsStyle="info">{level}</Label>
          </div>
        }
      >
        <SkillBody criteria={criteria} questions={questions}/>
        <SkillActions
          skillStatus={skillStatus}
          onAttained={() => updateSkillStatus(id, SKILL_STATUS.ATTAINED, skillUid).then(() => postUpdateNavigation())}
          onNotAttained={() => updateSkillStatus(id, SKILL_STATUS.NOT_ATTAINED, skillUid).then(() => postUpdateNavigation())}
          onFeedbackRequest={() => updateSkillStatus(id, SKILL_STATUS.FEEDBACK, skillUid).then(() => postUpdateNavigation())}
          onSetObjective={() => updateSkillStatus(id, SKILL_STATUS.OBJECTIVE, skillUid).then(() => postUpdateNavigation())}
        />
      </Panel>
        <ButtonGroup className="pull-right">
          <Button
            disabled={isFirstSkill}
            onClick={() => prevSkill(skillUid)}
          >
            <Glyphicon glyph="chevron-left"/>
            Previous skill
          </Button>
          <Button
            disabled={isLastSkill}
            onClick={() => nextSkill(skillUid)}
          >
            Next skill
            <Glyphicon glyph="chevron-right"/>
          </Button>
        </ButtonGroup>
    </div>
  );
};

export default Skill;
