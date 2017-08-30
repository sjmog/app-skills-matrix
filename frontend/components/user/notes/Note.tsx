import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as moment from 'moment';
import { Media, Glyphicon } from 'react-bootstrap';
import * as selectors from '../../../modules/user';
import { actionCreators } from '../../../modules/user/notes';

// TODO: fix types
type NoteProps = {
  note: any,
  skillUid: any,
  loggedInUserId: any,
  author: any,
};

// TODO: Destructure note or use selectors
const Note = ({ noteId, evaluationId, skillId, skillUid, author, note, noteActions, loggedInUserId }) => {
  // TODO: Assumes note can never be an empty string.
  /* Covers the case where a skill references as a note that does not exist in state
    this should not occur, but if it does, having the id is useful for debugging */
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
          <strong>{`${author.name || author.username || 'Unknown user'}`}</strong>{' '}<i>{moment(note.date).format('ll')}</i>
          <br/>
          {note.note}
        </p>
      </Media.Body>
      <Media.Right>
        {
          note.userId === loggedInUserId
            ?
            <button className="remove" onClick={() => noteActions.deleteNote(evaluationId, skillId, skillUid, note.id)}>
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
    const note = selectors.getNote(state, noteId) as any; // TODO: fix this so it returns a note.
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
