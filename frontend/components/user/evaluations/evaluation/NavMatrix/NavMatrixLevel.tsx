import * as React from 'react';

import { getSkillGroup } from '../../../../common/helpers/index';
import NavMatrixSkillGroup from './NavMatrixSkillGroup';

type NavMatrixLevelProps = {
  categories: string[],
  levelName: string,
  skillGroups: NormalizedSkillGroups,
};

const NavMatrixLevel = ({ categories, levelName, skillGroups }: NavMatrixLevelProps) =>
  (
    <tr>
      <td>{levelName}</td>
      {
        categories.map(
          categoryName => (
            <NavMatrixSkillGroup
              key={categoryName}
              category={categoryName}
              skillGroup={getSkillGroup(levelName, categoryName, skillGroups)}
            />
          ),
        )
      }
    </tr>
  );

export default NavMatrixLevel;
