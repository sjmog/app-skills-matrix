type UserDetailsViewModel = {
  id: string,
  name: string,
  username: string,
  avatarUrl: string,
  email: string,
  mentorId: string,
  templateId: string,
};

type NormalizedUsers = { [id: string]: UserDetailsViewModel };

