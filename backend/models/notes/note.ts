import { DatabaseObject } from '../../database';

export type Note = {
  id: string,
  userId: string,
  viewModel: () => NoteViewModel,
  setDeletedFlag: () => UnhydratedNote,
};

export default ({ _id, userId, skillId, note, createdDate, deleted }: DatabaseObject & UnhydratedNote): Note => Object.freeze({
  id: String(_id),
  userId,
  viewModel() {
    return ({
      id: String(_id),
      userId,
      skillId,
      note,
      createdDate,
    });
  },
  setDeletedFlag() {
    return ({
      id: String(_id),
      userId,
      skillId,
      note,
      createdDate,
      deleted: true,
    });
  },
});

export const newNote = (userId: string, skillId: number, note: string): UnhydratedNote => ({
  skillId,
  userId,
  note,
  deleted: false,
  createdDate: new Date(),
});
