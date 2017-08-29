type EvaluationMetadataViewModel = {
  createdDate: Date,
  evaluationUrl: string,
  feedbackUrl: string,
  objectivesUrl: string,
  id: string,
  usersName: string,
  status: string,
  templateName: string,
  view: string,
};

type EvaluationViewModel = {
  id: string,
  subject: EvaluationUser,
  status: string,
  template: {},
  skillGroups: { [id: string]: UnhydratedSkillGroup },
  skills: { [id: string]: UnhydratedEvaluationSkill },
  view: string,
};

type UnhydratedEvaluationSkill = {
  id: number,
  name: string,
  type: string,
  criteria: string,
  questions: { title: string }[],
  status: { current: string | null, previous: string | null },
};

type EvaluationUser = { name: string, id: string, email: string };
