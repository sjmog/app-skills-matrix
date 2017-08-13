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
};

// TODO: Destructure note or use selectors
const Note = ({ skillUid, note, noteActions, loggedInUserId }) => (
  <Media>
    <Media.Left>
      <img width={64} height={64} src={note.author.avatarUrl} alt="User avatar"/>
    </Media.Left>
    <Media.Body>
      <p>{`${note.author.name || note.author.username} - ${moment(note.date).format('DD/MM/YYYY')}`}</p>
      <p>{note.note}</p>
    </Media.Body>
    <Media.Right>
      {
        note.author.id === loggedInUserId
          ? <Button onClick={() => noteActions.removeNote(skillUid, note.id)}>
              <Glyphicon glyph="remove-sign"/>
            </Button>
          : false
      }
    </Media.Right>
  </Media>
);

export default connect(
  (state, { noteId }) => ({
    note: selectors.getNote(state, noteId),
    loggedInUserId: selectors.getLoggedInUserId(state),
  }),
  dispatch => ({
    noteActions: bindActionCreators(actionCreators, dispatch),
  }),
)(Note);
