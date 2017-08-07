import * as React from 'react';
import { connect } from 'react-redux';
import * as moment from 'moment';
import { Media } from 'react-bootstrap';
import * as selectors from '../../../modules/user';

// TODO: fix types
type NoteProps = {
  note: any,
};

// TODO: Destructure note or use selectors
const Note = ({ note }) => (
  <Media>
    <Media.Left>
      <img width={64} height={64} src={note.author.avatarUrl} alt="User avatar"/>
    </Media.Left>
    <Media.Body>
      <p>{`${note.author.name || note.author.username} - ${moment(note.date).format('DD/MM/YYYY')}`}</p>
      <p>{note.note}</p>
    </Media.Body>
  </Media>
);

export default connect(
  (state, { noteId }) => ({
    note: selectors.getNote(state, noteId),
  }),
)(Note);
