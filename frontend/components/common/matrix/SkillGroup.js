import React, { PropTypes } from 'react';
import { Table } from 'react-bootstrap';
import R from 'ramda';

import Skill from './Skill';

const SkillGroup = ({ skillGroup, skills, viewSkillDetails, skillBeingEvaluated }) => (
  <td>
    <Table bordered>
      <tbody>
      {
        R.reverse(skillGroup.skills).map(
          (skillId) => {
            const skill = skills[skillId];

            return (
              <Skill
                key={skillId}
                skill={skill}
                viewSkillDetails={viewSkillDetails}
                isBeingEvaluated={skillBeingEvaluated === skillId}
              />
            )
          })
      }
      </tbody>
    </Table>
  </td>
);

SkillGroup.propTypes = {
  skillGroup: PropTypes.object.isRequired,
  skills: PropTypes.object.isRequired,
  skillBeingEvaluated: PropTypes.number,
};

export default SkillGroup;

