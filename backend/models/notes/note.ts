type UnhydratedNote = {
  note: string,
  userId: string,
  skillId: string
  createdDate: string,
  _id: object,
};

export type Note = {
  id: string,
  viewModel: () => UnhydratedNote,
};

export default ({ _id, userId, skillId, note, createdDate }: UnhydratedNote): Note => Object.freeze({
  id: _id.toString(),
  viewModel() {
    return ({
      id: String(_id),
      userId,
      skillId,
      note,
      createdDate,
    });
  },
});

// TODO:  Can we use TS UnhydratedNote  here?
export const newNote = (userId: string, skillId: string,  note: string) => ({
  skillId,
  userId,
  note,
  createdDate: new Date(),
});
