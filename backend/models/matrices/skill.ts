export type Skill = {
  id: string,
  viewModel: () => TemplateSkillViewModel,
  evaluationData: () => UnhydratedTemplateSkill,
};

export default ({ id, name, version, criteria, type, questions }: UnhydratedTemplateSkill): Skill => Object.freeze({
  id,
  viewModel() {
    return { id, name };
  },
  evaluationData() {
    return { id, name, version, criteria, type, questions };
  },
});

export const newSkill = (id: string, name: string, type: string, version: number = 1, criteria: string, questions: Question[]) =>
  ({
    id,
    name,
    type,
    version,
    criteria,
    questions,
    createdDate: new Date(),
  });
