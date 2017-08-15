export type Skill = {
  id: number,
  data: () => UnhydratedTemplateSkill,
};

export default ({ id, name, version, criteria, type, questions }: UnhydratedTemplateSkill): Skill => Object.freeze({
  id,
  data() {
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
