import React, { PropTypes } from 'react';
import { Table } from 'react-bootstrap';

import Skill from './Skill';

const SkillGroup = ({ skillGroup, skills, viewSkillDetails, skillBeingEvaluated, canViewDetails }) =>
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
                  isBeingEvaluated={skillBeingEvaluated === skillId}
                  canViewDetails={canViewDetails}
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
  canViewDetails: PropTypes.bool
};

export default SkillGroup;

