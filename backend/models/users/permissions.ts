import { User } from './user';

export type Permissions = {
  viewActions: boolean,
};

const permissions = (loggedInUser: User, requestedUser: User): Permissions => {
  const loggedIn = Boolean(loggedInUser);
  const isAdmin = loggedIn && loggedInUser.isAdmin();
  const isMentor = loggedIn && loggedInUser.id === requestedUser.mentorId;
  const isUser = loggedIn && loggedInUser.id === requestedUser.id;
  return {
    viewActions: isAdmin || isMentor || isUser,
  };
};

export default permissions;
