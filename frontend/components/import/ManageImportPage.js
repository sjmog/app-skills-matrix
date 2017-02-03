import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Form, FormGroup, FormControl, ControlLabel, Radio, Button, Glyphicon, Alert } from 'react-bootstrap';
import { actions } from '../../modules/manageImport';

class ManageImportComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      import: {}
    };

    this.updateImportState = this.updateImportState.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  updateImportState(e) {
    const field = e.target.name;
    const importState = this.state.import;
    importState[field] = e.target.value;
    return this.setState({ import: importState });
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.actions.submitImport(this.state.import)
  }

  render() {
    return (
      <div>
        <Row>
          <h1 className="header">Import</h1>
        </Row>
        <Row className='show-grid'>
          <Form onSubmit={this.onSubmit}>
            <FormGroup>
              <ControlLabel>I am importing...</ControlLabel>
              <Radio
                name="type"
                value="template"
                onChange={this.updateImportState}
              >
                a new template
              </Radio>
              <Radio
                inline
                name='type'
                value='skills'
                onChange={this.updateImportState}
              >
                a list of new skills
              </Radio>
              {' '}
            </FormGroup>
            <FormGroup>
              <ControlLabel>Paste your JSON here</ControlLabel>
              <FormControl
                componentClass="textarea"
                name='jsonImport'
                value={this.state.import.jsonImport || ''}
                onChange={this.updateImportState}
              />
            </FormGroup>
            {' '}
            <Button bsStyle='primary' type="submit"><Glyphicon glyph='upload' /></Button>
          </Form>
          </Row>
          <Row>
            { this.props.success
              ? <Alert bsStyle='success'>Import successful</Alert>
              : false
            }
          </Row>
        </div>
      );
  }
}

export const ManageImportPage = connect(
  function mapStateToProps(state) {
    return state.manageImport
  },
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(actions, dispatch)
    };
  }
)(ManageImportComponent);
