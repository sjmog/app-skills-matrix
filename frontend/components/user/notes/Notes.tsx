import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, FormGroup, FormControl, Button, Alert } from 'react-bootstrap';
import * as selectors from '../../../modules/user';
import { actionCreators } from '../../../modules/user/notes';

import Note from './Note';

import './notes.scss';

type NotesProps = {
  skillUid: string,
  skillId: string,
  noteActions: typeof actionCreators,
  error?: string,
  sortedNotes: NoteViewModel[],
  evaluationId: string,
};

class Notes extends React.Component<NotesProps, any>{
  constructor(props) {
    super(props);
    this.state = { value: '' };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ value: '' });
    const { evaluationId, skillId, skillUid, noteActions: { addNote } } = this.props;
    addNote(evaluationId, skillId, skillUid, this.state.value);
  }

  render() {
    const { evaluationId, skillUid, sortedNotes, error } = this.props;

    return (
      <div className="notes">
        <h4>Notes</h4>
        { error ? <Alert bsStyle="danger"><p>{error}</p></Alert> : false }
        <Form onSubmit={this.handleSubmit}>
          <FormGroup controlId="noteTextarea">
            {' '}
            <FormControl
              componentClass="textarea"
              value={this.state.value}
              onChange={this.handleChange}
            />
          </FormGroup>
          {' '}
          <Button disabled={this.state.value.length === 0} type="submit">
            Add note
          </Button>
        </Form>
        {
          sortedNotes && sortedNotes.length
          ? sortedNotes.map(note =>
              <Note
                key={note && note.id}
                note={note}
                evaluationId={evaluationId}
                skillUid={skillUid}
              />)
          : false
      }
      </div>
    );
  }
}

export default connect(
  (state, { skillUid }) => {
    const noteIds = selectors.getNotesForSkill(state, skillUid);

    return {
      sortedNotes: selectors.getSortedNotes(state, noteIds),
      error: selectors.getNotesError(state),
    };
  },
  dispatch => ({
    noteActions: bindActionCreators(actionCreators, dispatch),
  }),
)(Notes);
