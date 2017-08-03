/* tslint:disable no-param-reassign */
import { Skill } from './skill';

type UnhydratedTemplate = {
  id: string,
  name: string,
  version: number,
  categories: string[],
  levels: string[],
  skillGroups: SkillGroup[],
};

export type Template = {
  id: string,
  skillGroups: SkillGroup[],
  viewModel: () => TemplateViewModel,
  normalizedViewModel: () => NormalizedTemplateViewModel,
  evaluationData: () => { id: string, name: string, version: number, categories: string[], levels: string[] },
  userDetailsViewModel: () => { name: string },
  createSkillGroups: (skills: Skill[]) => { skills: UnhydratedEvaluationSkill[], skillGroups: SkillGroup[] },
};

export default ({ id, name, version, categories, levels, skillGroups }: UnhydratedTemplate): Template => Object.freeze({
  id,
  skillGroups,
  viewModel() {
    return { id, name };
  },
  normalizedViewModel() {
    const skillGroupsWithId = skillGroups
      .map((skillGroup, index) => Object.assign({}, skillGroup, { id: index }));

    const indexedSkillGroups = skillGroupsWithId
      .reduce((collector, skillGroup) => {
        collector[skillGroup.id] = skillGroup;
        return collector;
      }, {});

    return { id, name, version, categories, levels, skillGroups: indexedSkillGroups };
  },
  evaluationData() {
    return { id, name, version, categories, levels };
  },
  userDetailsViewModel() {
    return { name };
  },
  createSkillGroups(allSkills) {
    let skills = [];
    const newSkillGroups = skillGroups.map((skillGroup, index) => {
      skills = skills.concat(skillGroup.skills.map(skillId =>
        Object.assign({}, allSkills[skillId].evaluationData(), { status: { previous: null, current: null } })));
      return ({
        id: index,
        category: skillGroup.category,
        level: skillGroup.level,
        skills: skillGroup.skills,
      });
    });
    return { skills, skillGroups: newSkillGroups };
  },
});

export const newTemplate = (id: string, name: string, skillGroups: SkillGroup[], levels: string[], categories: string[]) =>
  ({
    id,
    name,
    skillGroups,
    levels,
    categories,
    createdDate: new Date(),
  });
