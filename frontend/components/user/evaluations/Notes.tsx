import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Media, Form, FormGroup, FormControl, Button, Alert } from 'react-bootstrap';
import * as selectors from '../../../modules/user';
import { actionCreators } from '../../../modules/user/notes';

import * as moment from 'moment';

import '../evaluations/evaluation.scss';

// TODO: fix types
type NotesProps = any;

class Notes extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    console.log('event.target.value:', event.target.value);
    this.setState({ value: event.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { skillUid, noteActions: { addNote } } = this.props;
    addNote(skillUid, this.state.value);
  }

  render() {
    const { notes, skillUid, noteActions, error } = this.props;

    return (
      <div>
        <h3>Notes</h3>
        { error ? <Alert bsStyle="danger"><p>There was a problem adding your note</p></Alert> : false }
        <Form onSubmit={this.handleSubmit}>
          <FormGroup controlId="formInlineName">
            {' '}
            <FormControl type="text" onChange={this.handleChange} />
          </FormGroup>
          {' '}
          <Button
            type="submit">
            Add note
          </Button>
        </Form>
        {
          notes.map(({ author: { avatarUrl, name, username }, date, note }) =>
            (
              <Media>
                <Media.Left>
                  <img width={64} height={64} src={avatarUrl} alt="User avatar"/>
                </Media.Left>
                <Media.Body>
                  <p>{`${name || username} - ${moment(date).format('DD/MM/YYYY')}`}</p>
                  <p>{note}</p>
                </Media.Body>
              </Media>
            ))
        }
      </div>
    );
  }
}

export default connect(
  (state, { skillUid }) => {
    const noteIds = selectors.getNotesForSkill(state, skillUid);

    return {
      notes: selectors.getNotes(state, noteIds),
      error: selectors.getNotesError(state),
    };
  },
  dispatch => ({
    noteActions: bindActionCreators(actionCreators, dispatch),
  }),
)(Notes);
