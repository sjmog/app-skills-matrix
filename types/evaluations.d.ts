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
  createdDate: Date,
};

type UnhydratedEvaluationSkill = {
  id: number,
  name: string,
  type: string,
  criteria: string,
  questions: { title: string }[],
  status: { current: string | null, previous: string | null },
  notes?: string[],
};

type EvaluationSkillGroup = UnhydratedSkillGroup & { id: number };

type EvaluationUser = { name: string, id: string, email: string };

type PaginatedEvaluationSkill =
  UnhydratedEvaluationSkill & { skillUid: string, level: string, category: string, skillGroupId: number };
