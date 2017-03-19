import React, { PropTypes } from 'react';

import { getSkillGroup } from '../helpers';
import SkillGroup from './SkillGroup';

const Level = ({ categories, levelName, skillGroups, skills }) =>
  (
    <tr>
      <td>{<strong>{levelName}</strong>}</td>
      {
        categories.map(
          (categoryName) => (
            <SkillGroup
              key={categoryName}
              skillGroup={getSkillGroup(levelName, categoryName, skillGroups)}
              skills={skills}
            />
          )
        )
      }
    </tr>
  );

Level.propTypes = {
  categories: PropTypes.array.isRequired,
  levelName: PropTypes.string.isRequired,
  skillGroups: PropTypes.object.isRequired,
  skills: PropTypes.object.isRequired,
};

export default Level;
