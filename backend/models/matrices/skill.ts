type Question = {
  name: string,
};

type UnhydratedSkill = {
  id: string,
  name: string,
  version: number,
  criteria: string,
  type: string,
  questions: Question[],
};

export type Skill = {
  id: string,
  viewModel: () => { id: string, name: string },
  evaluationData: () => UnhydratedSkill,
};

export default ({ id, name, version, criteria, type, questions }: UnhydratedSkill): Skill => Object.freeze({
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
