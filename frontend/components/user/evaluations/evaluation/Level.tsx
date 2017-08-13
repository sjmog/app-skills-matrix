import * as React from 'react';

import { getSkillGroup } from '../../../common/helpers/index'; // TODO: Can we get rid of this now?
import SkillGroup from './SkillGroup';

type LevelProps = {
  categories: string[],
  levelName: string,
  skillGroups: any,
  viewSkillDetails: (skillUid: string) => void,
};

const Level = ({ categories, levelName, skillGroups, viewSkillDetails }: LevelProps) =>
  (
    <tr>
      <td>{levelName}</td>
      {
        categories.map(
          categoryName => (
            <SkillGroup
              key={categoryName}
              category={categoryName}
              skillGroup={getSkillGroup(levelName, categoryName, skillGroups)}
              viewSkillDetails={viewSkillDetails}
            />
          ),
        )
      }
    </tr>
  );

export default Level;
