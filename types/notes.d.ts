type UnhydratedNote = {
  note: string,
  userId: string,
  skillId: number,
  createdDate: Date,
  deleted: boolean,
};

type NoteViewModel = {
  id: string,
  note: string,
  userId: string,
  skillId: number,
  createdDate: Date,
};

type NormalizedNotes = { [id: string]: NoteViewModel };
