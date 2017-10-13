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

type ClientState = {
  user: {
    userDetails?: UserDetailsViewModel,
    template?: TemplateViewModel,
    mentorDetails?: UserDetailsViewModel,
    evaluations?: EvaluationMetadataViewModel[],
    menteeEvaluations?: EvaluationMetadataViewModel[],
    reportsEvaluations?: EvaluationMetadataViewModel[],
  },
};
