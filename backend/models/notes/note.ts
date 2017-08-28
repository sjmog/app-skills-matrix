type UnhydratedNote = {
  note: string,
  userId: string,
  skillId: string
  createdDate: string,
  deleted: boolean,
  _id: object,
};

export type Note = {
  id: string,
  userId: string,
  viewModel: () => UnhydratedNote,
  setDeletedFlag: () => any,
};

export default ({ _id, userId, skillId, note, createdDate, deleted }: UnhydratedNote): Note => Object.freeze({
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

// TODO:  Can we use TS UnhydratedNote  here?
export const newNote = (userId: string, skillId: string, note: string) => ({
  skillId,
  userId,
  note,
  deleted: false,
  createdDate: new Date(),
});
