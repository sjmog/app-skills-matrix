import React, { PropTypes } from 'react';
import { Table } from 'react-bootstrap';

import Skill from './Skill';

const SkillGroup = ({ skillGroup, skills, viewSkillDetails, currentSkill }) =>
  (
    <td>
      <Table bordered>
        <tbody>
        {
          skillGroup.skills.map(
            (skillId) => {
              const skill =  skills[skillId];

              return (
                <Skill
                  key={skillId}
                  skill={skill}
                  viewSkillDetails={viewSkillDetails}
                  isCurrentSkill={currentSkill === skillId}
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
  currentSkill: PropTypes.number,
};

export default SkillGroup;

