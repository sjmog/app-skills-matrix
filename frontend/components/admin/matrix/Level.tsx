import * as React from 'react';

import { getSkillGroup } from '../../common/helpers/index';
import SkillGroup from './SkillGroup';

type LevelProps = {
  categories: string[],
  levelName: string,
  skillGroups: any, // TODO: fix type
  skills: any,
  viewSkillDetails: (e: any) => void,
};

const Level = ({ categories, levelName, skillGroups, skills, viewSkillDetails }: LevelProps) =>
  (
    <tr>
      <td>{<strong>{levelName}</strong>}</td>
      {
        categories.map(
          categoryName => (
            <SkillGroup
              key={categoryName}
              skillGroup={getSkillGroup(levelName, categoryName, skillGroups)}
              skills={skills}
              viewSkillDetails={viewSkillDetails}
            />
          ),
        )
      }
    </tr>
  );

export default Level;
