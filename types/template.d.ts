type Question = {
  title: string,
};

type UnhydratedTemplateSkill = {
  id: number,
  name: string,
  version: number,
  criteria: string,
  type: string,
  questions: Question[],
};

type SkillGroup = {
  id: number,
  category: string,
  level: string,
  skills: number[],
};

type TemplateViewModel = {
  id: string,
  name: string,
};

type NormalizedTemplateViewModel = {
  id: string,
  name: string,
  version: number,
  categories: string[],
  levels: string[],
  skillGroups: NormalizedSkillGroups,
};

type NormalizedSkillGroups = { [id: string]: SkillGroup };
