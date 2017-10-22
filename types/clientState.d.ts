type UserWithEvaluations = UserDetailsViewModel & { evaluations: EvaluationMetadataViewModel[] };

type MatricesInitialState = {
  templates: TemplateViewModel[],
};

type AdminClientState = {
  users: {
    users: UserWithEvaluations[],
    newEvaluations: any[],
  },
  matrices: MatricesInitialState,
};

type UserInitialState = {
  userDetails?: UserDetailsViewModel,
  template?: TemplateViewModel,
  mentorDetails?: UserDetailsViewModel,
  lineManagerDetails?: UserDetailsViewModel,
  evaluations: string[],
  mentees: string[],
  reports: string[],
};

type ClientState = {
  user: UserInitialState,
};
