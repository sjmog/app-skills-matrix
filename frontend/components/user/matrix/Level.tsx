import * as React from 'react';

import { getSkillGroup } from '../../common/helpers/index';
import SkillGroup from './SkillGroup';

type LevelProps = {
  categories: string[],
  levelName: string,
  skillGroups: NormalizedSkillGroups,
  viewSkillDetails: (skillUid: string) => void,
};

const Level = ({ categories, levelName, skillGroups, viewSkillDetails }: LevelProps) =>
  (
    <tr>
      <td>{<strong>{levelName}</strong>}</td>
      {
        categories.map(
          categoryName => (
            <SkillGroup
              key={categoryName}
              skillGroup={getSkillGroup(levelName, categoryName, skillGroups)}
              viewSkillDetails={viewSkillDetails}
            />
          ),
        )
      }
    </tr>
  );

export default Level;
