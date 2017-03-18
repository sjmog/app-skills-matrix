import React, { PropTypes } from 'react';
import { Table } from 'react-bootstrap';

import Skill from './Skill';

const SkillGroup = ({ skillGroup, skills }) =>
  (
    <td>
      <Table bordered>
        <tbody>
        {
          skillGroup.skills.map(
            (skillId) => {
              const { name, status } =  skills[skillId];

              return (
                <Skill
                  key={skillId}
                  name={name}
                  status={status}
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
};

export default SkillGroup;

