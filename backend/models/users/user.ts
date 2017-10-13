import auth from '../auth';

export type UnhyrdatedUser = {
  _id: string,
  name: string,
  email: string,
  username: string,
  templateId: string,
  mentorId: string,
  lineManagerId: string,
  avatarUrl: string,
};

export type UserFeedback = {
  id: string, name: string, mentorId: string,
};

export type User = {
  id: string,
  name: string,
  templateId: string,
  username: string,
  mentorId: string,
  lineManagerId: string,
  email: string,
  isAdmin: () => boolean,
  manageUserViewModel: () => UserDetailsViewModel, // TODO: combine these
  userDetailsViewModel: () => UserDetailsViewModel,
  feedbackData: () => UserFeedback,
  signingData: () => { id: string, username: string },
  evaluationData: () => { id: string, name: string, email: string },
  hasTemplate: boolean,
  hasMentor: boolean,
  hasLineManager: boolean,
  setMentor: (newMentorId: string) => ErrorMessage | { mentorId: string, modifiedDate: Date },
  setLineManager: (newLineManagerId: string) => ErrorMessage | { lineManagerId: string, modifiedDate: Date },
  setTemplate: (newTemplateId: string) => { templateId: string, modifiedDate: Date },
  toString: () => string,
};

const user = ({ _id, name, email, username, templateId, mentorId, lineManagerId, avatarUrl }: UnhyrdatedUser): User => ({
  id: _id.toString(),
  name,
  username,
  templateId,
  mentorId,
  lineManagerId,
  email,
  isAdmin(): boolean {
    return auth.isAdmin(email);
  },
  manageUserViewModel() {
    return ({ id: _id.toString(), username, name, avatarUrl, email, mentorId, lineManagerId, templateId });
  },
  feedbackData() {
    return ({ id: _id.toString(), name: name || username, mentorId });
  },
  signingData() {
    return ({ id: _id.toString(), username });
  },
  evaluationData() {
    return ({ id: _id.toString(), name: name || username, email });
  },
  userDetailsViewModel() {
    return ({ id: _id.toString(), name, username, avatarUrl, email, mentorId, lineManagerId, templateId });
  },
  hasTemplate: Boolean(templateId),
  hasMentor: Boolean(mentorId),
  hasLineManager: Boolean(lineManagerId),
  setMentor(newMentorId: string) {
    if (newMentorId === _id.toString()) {
      return { error: true, message: `User '${newMentorId}' can not mentor themselves` };
    }

    return { mentorId: newMentorId, modifiedDate: new Date() };
  },
  setLineManager(newLineManagerId: string) {
    if (newLineManagerId === _id.toString()) {
      return { error: true, message: `User '${newLineManagerId}' can not manage themselves` };
    }

    return { lineManagerId: newLineManagerId, modifiedDate: new Date() };
  },
  setTemplate(newTemplateId: string) {
    return { templateId: newTemplateId, modifiedDate: new Date() };
  },
  toString() {
    return JSON.stringify(this);
  },
});

export default user;
export const newUser = (name: string, email: string, avatarUrl: string, username: string) => ({
  username,
  name,
  email,
  createdDate: new Date(),
  avatarUrl,
});
