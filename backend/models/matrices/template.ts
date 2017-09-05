/* tslint:disable no-param-reassign */
import { Skill } from './skill';
import * as R from 'ramda';

export type EvaluationTemplate = { id: string, name: string, version: number, categories: string[], levels: string[] };

export type Template = {
  id: string,
  skillGroups: UnhydratedSkillGroup[],
  viewModel: () => TemplateViewModel,
  normalizedViewModel: () => NormalizedTemplateViewModel,
  evaluationData: () => EvaluationTemplate,
  userDetailsViewModel: () => { name: string },
  createSkillGroups: (skills: Skill[]) => { skills: UnhydratedEvaluationSkill[], skillGroups: UnhydratedSkillGroup[] },
  addSkill: (level: string, category: string, skillId: number) => Template,
  replaceSkill: (level: string, category: string, oldId: number, newId: number) => Template,
  removeSkill: (level: string, category: string, skillId: number) => Template,
  hasLevel: (level: string) => boolean,
  hasCategory: (category: string) => boolean,
};


const getSkillGroup = (level: string, category: string, skillGroups: UnhydratedSkillGroup[]) =>
  R.find((group: UnhydratedSkillGroup) => (group.level === level && group.category === category), skillGroups);

const template = ({ id, name, version, categories, levels, skillGroups }: UnhydratedTemplate): Template => Object.freeze({
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
        Object.assign({}, allSkills[skillId].data(), { status: { previous: null, current: null } })));
      return ({
        id: index,
        category: skillGroup.category,
        level: skillGroup.level,
        skills: skillGroup.skills,
      });
    });
    return { skills, skillGroups: newSkillGroups };
  },
  addSkill(level, category, skillId) {
    const skillGroup = getSkillGroup(level, category, skillGroups);
    skillGroup.skills.push(skillId);
    return template({ id, name, version, categories, levels, skillGroups });
  },
  replaceSkill(level, category, oldId, newId) {
    const skillGroup = getSkillGroup(level, category, skillGroups);
    skillGroup.skills.push(newId);
    skillGroup.skills.splice(skillGroup.skills.indexOf(oldId), 1);
    return template({ id, name, version, categories, levels, skillGroups });
  },
  removeSkill(level, category, skillId) {
    const skillGroup = getSkillGroup(level, category, skillGroups);
    skillGroup.skills.splice(skillGroup.skills.indexOf(skillId), 1);
    return template({ id, name, version, categories, levels, skillGroups });
  },
  hasLevel(level) {
    return R.contains(level, levels);
  },
  hasCategory(category) {
    return R.contains(category, categories);
  },
});

export default template;
export const newTemplate = (id: string, name: string, skillGroups: UnhydratedSkillGroup[], levels: string[], categories: string[]) =>
  ({
    id,
    name,
    skillGroups,
    levels,
    categories,
    createdDate: new Date(),
  });
