import * as React from 'react';

import { getSkillGroup } from '../../common/helpers/index';
import SkillGroup from './SkillGroup';

type LevelProps = {
  categories: string[],
  levelName: string,
  skillGroups: NormalizedSkillGroups,
  skills: UnhydratedTemplateSkill[],
  viewSkillDetails: (level: string, category: string, skill: UnhydratedTemplateSkill) => void,
  viewAddExistingSkill: (level: string, category: string) => void,
  onAddSkill: (level: string, category: string, existingSkillId?: string) => void,
};

const Level = ({ categories, levelName, skillGroups, skills, viewSkillDetails, viewAddExistingSkill, onAddSkill }: LevelProps) => (
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
            viewAddExistingSkill={viewAddExistingSkill}
            onAddSkill={onAddSkill}
          />
        ),
      )
    }
  </tr>
);

export default Level;
