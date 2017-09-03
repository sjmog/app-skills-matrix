import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as moment from 'moment';
import { Media, Glyphicon } from 'react-bootstrap';
import * as selectors from '../../../modules/user';
import { actionCreators } from '../../../modules/user/notes';

type NoteProps = {
  evaluationId: string,
  skillId: number,
  noteId: string,
  note: NoteViewModel,
  noteActions: typeof actionCreators,
  skillUid: string,
  loggedInUserId: string,
  author: UserDetailsViewModel,
};

const Note = ({ noteId, evaluationId, skillId, skillUid, author, note, noteActions, loggedInUserId }: NoteProps) => {
  if (!note.userId || !note.note || !note.userId) {
    return (
      <Media>
        <Media.Left>
          <Glyphicon className="note__glyph" glyph="exclamation-sign"/>
        </Media.Left>
        <Media.Body>
          <p><strong>{`Unable to display note (ID: ${noteId})`}</strong></p>
        </Media.Body>
      </Media>
    );
  }

  return (
    <Media>
      <Media.Left>
        {
          author.avatarUrl
            ? <img width={64} height={64} src={author.avatarUrl} alt="User avatar"/>
            : <Glyphicon className="note__glyph" glyph="user"/>
        }
      </Media.Left>
      <Media.Body>
        <p>
          <strong>{`${author.name || author.username || 'Unknown user'}`}</strong>{' '}
          <i>{moment(note.createdDate).format('ll')}</i>
          <br/>
          {note.note}
        </p>
      </Media.Body>
      <Media.Right>
        {
          note.userId === loggedInUserId
            ? <button className="remove" onClick={() => noteActions.deleteNote(evaluationId, skillId, skillUid, note.id)}>
                <Glyphicon glyph="remove"/>
              </button>
            : false
        }
      </Media.Right>
    </Media>
  );
};

export default connect(
  (state, { noteId }) => {
    const note = selectors.getNote(state, noteId) as any; // TODO: Fix types.

    return {
      note,
      author: selectors.getUser(state, note.userId),
      loggedInUserId: selectors.getLoggedInUserId(state),
    };
  },
  dispatch => ({
    noteActions: bindActionCreators(actionCreators, dispatch),
  }),
)(Note);
