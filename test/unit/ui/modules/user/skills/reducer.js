import {expect} from 'chai';
import reducer, {actionTypes} from '../../../../../../frontend/modules/user/skills';
import {actionTypes as noteActionTypes} from '../../../../../../frontend/modules/user/notes';

describe('Skills reducer', () => {
  describe('SKILL_STATUS_UPDATE_SUCCESS', () => {
    it('updates the current status of a skill', () => {
      const state = {
        entities: {
          SKILL_ID: { status: { current: null, previous: null } },
        },
        errors: {},
      };

      const action = {
        type: actionTypes.SKILL_STATUS_UPDATE_SUCCESS,
        payload: { skillUid: 'SKILL_ID', status: 'NEW_STATUS' },
      };

      expect(reducer(state, action)).to.eql({
        entities: {
          SKILL_ID: { status: { current: 'NEW_STATUS', previous: null } },
        },
        errors: {},
      });
    });

    it('clears any existing errors for a skill on a successful update', () => {
      const state = {
        entities: {
          SKILL_ID: { status: { current: null, previous: null } },
        },
        errors: {
          SKILL_ID: 'MSG',
        },
      };

      const action = {
        type: actionTypes.SKILL_STATUS_UPDATE_SUCCESS,
        payload: { skillUid: 'SKILL_ID', status: 'NEW_STATUS' },
      };

      expect(reducer(state, action)).to.eql({
        entities: {
          SKILL_ID: { status: { current: 'NEW_STATUS', previous: null } },
        },
        errors: {},
      });
    });
  });

  describe('SKILL_STATUS_UPDATE_FAILURE', () => {
    it('adds an error with a message', () => {
      const state = {
        errors: {},
      };

      const action = {
        type: actionTypes.SKILL_STATUS_UPDATE_FAILURE,
        payload: { skillUid: 'SKILL_ID', error: { message: 'MSG' } },
      };

      expect(reducer(state, action)).to.eql({ errors: { SKILL_ID: 'MSG' } });
    });

    it('sets the message to unknown when the error has no message', () => {
      const state = {
        errors: {},
      };

      const action = {
        type: actionTypes.SKILL_STATUS_UPDATE_FAILURE,
        payload: { skillUid: 'SKILL_ID', error: 'foo' },
      };

      expect(reducer(state, action)).to.eql({ errors: { SKILL_ID: 'unknown' } });
    });

    it('adds a new error when there is a failure for a different skill', () => {
      const state = {
        errors: {
          SKILL_ID_1: 'MSG_1',
        },
      };

      const action = {
        type: actionTypes.SKILL_STATUS_UPDATE_FAILURE,
        payload: { skillUid: 'SKILL_ID_2', error: { message: 'MSG_2' } },
      };

      expect(reducer(state, action)).to.eql({ errors: { SKILL_ID_1: 'MSG_1', SKILL_ID_2: 'MSG_2' } });
    });

    it('overrides an existing error for a skill when there is another failure', () => {
      const state = {
        errors: {
          SKILL_ID: 'MSG_1',
        },
      };
      const action = {
        type: actionTypes.SKILL_STATUS_UPDATE_FAILURE,
        payload: { skillUid: 'SKILL_ID', error: { message: 'MSG_2' } },
      };

      expect(reducer(state, action)).to.eql({ errors: { SKILL_ID: 'MSG_2' } });
    });
  });

  describe('ADD_NOTE_SUCCESS', () => {
    it('adds a new note', () => {
      const state = {
        entities: {
          SKILL_ID: {
            notes: [],
          }
        }
      };

      const action = {
        type: noteActionTypes.ADD_NOTE_SUCCESS,
        payload: {
          skillUid: 'SKILL_ID',
          note: { id: 'note_1' }
        }
      };

      expect(reducer(state, action).entities).to.eql({ SKILL_ID: { notes: ['note_1'] } })
    });

    it('does not alter anything but the notes property of a skill', () => {
      const state = {
        entities: {
          SKILL_ID: {
            a: 'A',
            notes: [],
          }
        }
      };

      const action = {
        type: noteActionTypes.ADD_NOTE_SUCCESS,
        payload: {
          skillUid: 'SKILL_ID',
          note: { id: 'note_1' }
        }
      };

      expect(reducer(state, action).entities).to.eql({ SKILL_ID: { a: 'A', notes: ['note_1'] } })
    });

    it('adds new note to the front of an existing list of notes', () => {
      const state = {
        entities: {
          SKILL_ID: {
            notes: ['note_1'],
          }
        }
      };

      const action = {
        type: noteActionTypes.ADD_NOTE_SUCCESS,
        payload: {
          skillUid: 'SKILL_ID',
          note: { id: 'note_2' }
        }
      };

      expect(reducer(state, action).entities).to.eql({ SKILL_ID: { notes: ['note_2', 'note_1'] } })
    });

    it('does not add a note if there is no associated skill entity', () => {
      const state = {
        entities: {
          SKILL_ID_1: {
            notes: ['note_1'],
          }
        }
      };
      const action = {
        type: noteActionTypes.ADD_NOTE_SUCCESS,
        payload: {
          skillUid: 'SKILL_ID_2',
          note: { id: 'note_2' }
        }
      };

      expect(reducer(state, action).entities).to.eql({ SKILL_ID_1: { notes: ['note_1'] } });
    });

    it('adds a note when a skill has no existing notes property', () => {
      const state = {
        entities: {
          SKILL_ID: {
            no: 'notes',
          }
        }
      };
      const action = {
        type: noteActionTypes.ADD_NOTE_SUCCESS,
        payload: {
          skillUid: 'SKILL_ID',
          note: { id: 'note_1' }
        }
      };

      expect(reducer(state, action).entities).to.eql({ SKILL_ID: { no: 'notes', notes: ['note_1'] } })
    });

    it('does not alter state when there are no skill entities', () => {
      const state = {
        NO: 'ENTITIES'
      };
      const action = {
        type: noteActionTypes.ADD_NOTE_SUCCESS,
        payload: {
          skillUid: 'SKILL_ID',
          note: { id: 'note_1' }
        }
      };

      expect(reducer(state, action)).to.eql({ NO: 'ENTITIES' })
    });

    it('does not alter state when payload is malformed', () => {
      const state = {
        entities: {
          SKILL_ID: { notes: ['note_1'] }
        }
      };

      [{}, [], { a: 'A', note: { id: 'note_2' } }, { skillUid: 'SKILL_ID', b: 'B' }].forEach(payload =>
        expect(reducer(state, {
          type: noteActionTypes.ADD_NOTE_SUCCESS,
          payload
        })).to.eql({ entities: { SKILL_ID: { notes: ['note_1'] } } }))
    });
  });

  describe('REMOVE_NOTE_SUCCESS', () => {
    it('removes an existing note', () => {
      const state = {
        entities: {
          SKILL_ID: {
            notes: ['note_1'],
          }
        }
      };

      const action = {
        type: noteActionTypes.REMOVE_NOTE_SUCCESS,
        payload: {
          skillUid: 'SKILL_ID',
          noteId: 'note_1',
        }
      };

      expect(reducer(state, action).entities).to.eql({ SKILL_ID: { notes: [] } })
    });

    it('removes an existing note and leaves others alone', () => {
      const state = {
        entities: {
          SKILL_ID: {
            notes: ['note_1', 'note_2'],
          }
        }
      };

      const action = {
        type: noteActionTypes.REMOVE_NOTE_SUCCESS,
        payload: {
          skillUid: 'SKILL_ID',
          noteId: 'note_1',
        }
      };

      expect(reducer(state, action).entities).to.eql({ SKILL_ID: { notes: ['note_2'] } })
    });

    it("leaves existing notes alone when the id is for a note the skill doesn't have", () => {
      const state = {
        entities: {
          SKILL_ID: {
            notes: ['note_1'],
          }
        }
      };

      const action = {
        type: noteActionTypes.REMOVE_NOTE_SUCCESS,
        payload: {
          skillUid: 'SKILL_ID',
          noteId: 'note_2',
        }
      };

      expect(reducer(state, action).entities).to.eql({ SKILL_ID: { notes: ['note_1'] } })
    });

    it("leaves existing notes alone no id is provided", () => {
      const state = {
        entities: {
          SKILL_ID: {
            notes: ['note_1'],
          }
        }
      };

      const action = {
        type: noteActionTypes.REMOVE_NOTE_SUCCESS,
        payload: {
          skillUid: 'SKILL_ID',
          noteId: null,
        }
      };

      expect(reducer(state, action).entities).to.eql({ SKILL_ID: { notes: ['note_1'] } })
    });

    it("leaves existing notes alone when there is no note id property", () => {
      const state = {
        entities: {
          SKILL_ID: {
            notes: ['note_1'],
          }
        }
      };

      const action = {
        type: noteActionTypes.REMOVE_NOTE_SUCCESS,
        payload: {
          skillUid: 'SKILL_ID',
          foo: 'bar',
        }
      };

      expect(reducer(state, action).entities).to.eql({ SKILL_ID: { notes: ['note_1'] } })
    });

    it("leaves existing notes alone when there is no skill uid property", () => {
      const state = {
        entities: {
          SKILL_ID: {
            notes: ['note_1'],
          }
        }
      };

      const action = {
        type: noteActionTypes.REMOVE_NOTE_SUCCESS,
        payload: {
          foo: 'bar',
          noteId: null,
        }
      };

      expect(reducer(state, action).entities).to.eql({ SKILL_ID: { notes: ['note_1'] } })
    });

    it("leaves state alone when the skill doesn't exist", () => {
      const state = {
        entities: {
          SKILL_ID_1: {
            notes: ['note_1'],
          }
        }
      };

      const action = {
        type: noteActionTypes.REMOVE_NOTE_SUCCESS,
        payload: {
          skillUid: 'SKILL_ID_2',
          noteId: 'note_1',
        }
      };

      expect(reducer(state, action).entities).to.eql({ SKILL_ID_1: { notes: ['note_1'] } })
    });
  });
});
