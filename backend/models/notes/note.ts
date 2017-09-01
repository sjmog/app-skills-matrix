import { DatabaseObject } from '../../database';

export type Note = {
  id: string,
  userId: string,
  viewModel: () => NoteViewModel,
  setDeletedFlag: () => UnhydratedNote,
};

export default ({ _id, userId, skillId, note, createdDate, deleted }: DatabaseObject & UnhydratedNote): Note => Object.freeze({
  id: _id.toString(),
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

export const newNote = (userId: string, skillId: number, note: string) => ({
  skillId,
  userId,
  note,
  deleted: false,
  createdDate: new Date(),
});
