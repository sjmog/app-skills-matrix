import * as React from 'react';

import { getSkillGroup } from '../../common/helpers/index';
import SkillGroupComponent from './SkillGroup';

type LevelProps = {
  categories: string[],
  levelName: string,
  skillGroups: SkillGroup[],
  viewSkillDetails: (skillUid: string) => void,
};

const Level = ({ categories, levelName, skillGroups, viewSkillDetails }: LevelProps) =>
  (
    <tr>
      <td>{<strong>{levelName}</strong>}</td>
      {
        categories.map(
          categoryName => (
            <SkillGroupComponent
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
