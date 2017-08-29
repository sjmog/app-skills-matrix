import * as React from 'react';

import { getSkillGroup } from '../../common/helpers/index';
import SkillGroup from './SkillGroup';

type LevelProps = {
  categories: string[],
  levelName: string,
  skillGroups: NormalizedSkillGroups,
  skills: UnhydratedTemplateSkill[],
  viewSkillDetails: (level: string, category: string, skill: UnhydratedTemplateSkill) => void,
  onAddSkill: (level: string, category: string, existingSkillId: number) => void,
};

const Level = ({ categories, levelName, skillGroups, skills, viewSkillDetails, onAddSkill }: LevelProps) =>
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
              onAddSkill={onAddSkill}
            />
          ),
        )
      }
    </tr>
  );

export default Level;
