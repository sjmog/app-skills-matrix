import React, { PropTypes } from 'react';
import { Panel, Label, ButtonGroup, Button, Glyphicon } from 'react-bootstrap';

import { SKILL_STATUS } from '../../../../modules/user/evaluations';

import SkillActions from '../../../common/SkillActions';
import SkillBody from './SkillBody';
import '../evaluation.scss';

const Skill = ({ level, skill, skillStatus, updateSkillStatus, postUpdateNavigation, prevSkill, nextSkill, isFirstSkill, isLastSkill }) => {
  const { name, skillId, updateId, criteria, questions } = skill;

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
          onAttained={() => updateSkillStatus(updateId, SKILL_STATUS.ATTAINED, skillId).then(() => postUpdateNavigation())}
          onNotAttained={() => updateSkillStatus(updateId, SKILL_STATUS.NOT_ATTAINED, skillId).then(() => postUpdateNavigation())}
          onFeedbackRequest={() => updateSkillStatus(updateId, SKILL_STATUS.FEEDBACK, skillId).then(() => postUpdateNavigation())}
          onSetObjective={() => updateSkillStatus(updateId, SKILL_STATUS.OBJECTIVE, skillId).then(() => postUpdateNavigation())}
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

Skill.propTypes = {
  isLastSkill: PropTypes.bool.isRequired,
  isFirstSkill: PropTypes.bool.isRequired,
  level: PropTypes.string.isRequired,
  skill: PropTypes.shape({
    skillId: PropTypes.string.isRequired,
  }),
  updateSkillStatus: PropTypes.func.isRequired,
  postUpdateNavigation: PropTypes.func.isRequired,
  nextSkill: PropTypes.func.isRequired,
  prevSkill: PropTypes.func.isRequired,
};

export default Skill;
