// @flow
/* eslint-disable no-param-reassign */
import type { Skill } from './skill';
import type { UnhydratedSkill as EvaluationSkill } from '../evaluations/skill';

export type SkillGroup = { id: string, category: string, level: string, skills: Array<number> }

type UnhydratedTemplate = {
  id: string,
  name: string,
  version: number,
  categories: Array<string>,
  levels: Array<string>,
  skillGroups: Array<SkillGroup>,
}

type NormalizedTemplateViewModel = {
  id: string,
  name: string,
  version: number,
  categories: Array<string>,
  levels: Array<string>,
  skillGroups: { [string]: SkillGroup }
}

export type Template = {
  id: string,
  skillGroups: Array<SkillGroup>,
  viewModel: () => { id: string, name: string },
  normalizedViewModel: () => NormalizedTemplateViewModel,
  evaluationData: () => { id: string, name: string, version: number, categories: Array<string>, levels: Array<string> },
  userDetailsViewModel: () => { name: string },
  createSkillGroups: (Array<Skill>) => { skills: Array<EvaluationSkill>, skillGroups: Array<SkillGroup> },
}

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
        id: index.toString(),
        category: skillGroup.category,
        level: skillGroup.level,
        skills: skillGroup.skills,
      });
    });
    return { skills, skillGroups: newSkillGroups };
  },
});

export const newTemplate = (id: string, name: string, skillGroups: Array<SkillGroup>, levels: Array<string>, categories: Array<string>) =>
  ({
    id,
    name,
    skillGroups,
    levels,
    categories,
    createdDate: new Date(),
  });
