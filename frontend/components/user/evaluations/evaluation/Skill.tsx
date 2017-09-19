import * as React from 'react';
import { Panel, ButtonGroup, Button, Glyphicon } from 'react-bootstrap';

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

const Skill = ({ evaluationId, skill, skillStatus, updateSkillStatus, nextUnevaluatedSkill, isLastSkill }: SkillProps) => {
  const { name, skillUid, id, criteria, questions } = skill;

  return (
    <div>
      <Panel key={skillUid}>
        {skillStatus.previous === SKILL_STATUS.NEW ?
          <p>Note: This skill is new since your last evaluation.</p>
          : null}
        <h4 className="skill-header__title">{name}</h4>
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
            <Glyphicon glyph="chevron-right" />
          </Button>
        </ButtonGroup>
        <Notes evaluationId={evaluationId} skillId={id} skillUid={skillUid} />
      </Panel>
    </div>
  );
};

export default Skill;
