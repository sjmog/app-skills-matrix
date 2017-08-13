import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, FormGroup, FormControl, Button, Alert } from 'react-bootstrap';
import * as selectors from '../../../modules/user';
import { actionCreators } from '../../../modules/user/notes';

import Note from './Note';

import '../evaluations/evaluation.scss';

// TODO: fix types
type NotesProps = {
  skillUid: string,
  noteActions: any,
  error: any,
  noteIds: any,
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
    const { skillUid, noteActions: { addNote } } = this.props;
    addNote(skillUid, this.state.value);
  }

  render() {
    const { skillUid, noteIds, error } = this.props;

    return (
      <div>
        <h3>Notes</h3>
        { error ? <Alert bsStyle="danger"><p>There was a problem adding your note</p></Alert> : false }
        <Form onSubmit={this.handleSubmit}>
          <FormGroup controlId="formInlineName">
            {' '}
            <FormControl type="text" value={this.state.value} onChange={this.handleChange} />
          </FormGroup>
          {' '}
          <Button
            type="submit">
            Add note
          </Button>
        </Form>
        { noteIds.map(noteId => <Note key={noteId} skillUid={skillUid} noteId={noteId} />) }
      </div>
    );
  }
}

export default connect(
  (state, { skillUid }) => ({
    noteIds: selectors.getNotesForSkill(state, skillUid),
    error: selectors.getNotesError(state),
  }),
  dispatch => ({
    noteActions: bindActionCreators(actionCreators, dispatch),
  }),
)(Notes);
