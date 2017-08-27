import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as moment from 'moment';
import { Media, Button, Glyphicon } from 'react-bootstrap';
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
const Note = ({ skillUid, author, note, noteActions, loggedInUserId }) => (
  <Media>
    <Media.Left>
      <img width={64} height={64} src={author.avatarUrl} alt="User avatar"/>
    </Media.Left>
    <Media.Body>
      <p>
        <b>{`${author.name || author.username}`}</b>{' '}<i>{moment(note.date).format('ll')}</i>
        <br/>
        {note.note}
      </p>
    </Media.Body>
    <Media.Right>
      {
        note.userId === loggedInUserId
          ? <button className="remove" onClick={() => noteActions.removeNote(skillUid, note.id)}>
            <Glyphicon glyph="remove"/>
          </button>
          : false
      }
    </Media.Right>
  </Media>
);

export default connect(
  (state, { noteId }) => {
    const note = selectors.getNote(state, noteId) as any; // TODO: fix this so it returns a note.
    // TODO: NO NOTE IN STATE BECAUSE WE DON'T FETCH THEM ON FIRST LOAD
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
