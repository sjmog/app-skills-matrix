import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Form, FormGroup, FormControl, ControlLabel, Radio, Button, Glyphicon, Alert } from 'react-bootstrap';
import { actions } from '../../modules/manageMatrices';

class AddTemplateComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { template: '' };

    this.updateNewTemplateState = this.updateNewTemplateState.bind(this);
    this.onAddTemplate = this.onAddTemplate.bind(this);
  }

  updateNewTemplateState(e) {
    return this.setState({ template: e.target.value });
  }

  onAddTemplate(e) {
    e.preventDefault();
    this.props.actions.addTemplate(this.state.template)
  }

  render() {
    return (
      <div>
        <Row>
          <h2 className="header">New template</h2>
        </Row>
        <Row className='show-grid'>
          <Form onSubmit={this.onAddTemplate}>
            <FormGroup>
              <ControlLabel>Paste your JSON here</ControlLabel>
              <FormControl
                componentClass="textarea"
                name='template'
                value={this.state.template}
                onChange={this.updateNewTemplateState}
              />
            </FormGroup>
            {' '}
            <Button bsStyle='primary' type="submit"><Glyphicon glyph='upload' /></Button>
          </Form>
        </Row>
        <Row>
          { this.props.success
            ? <Alert bsStyle='success'>Template successfully saved</Alert>
            : false
          }
        </Row>
        <Row>
          { this.props.error ? <Alert bsStyle='danger'>Something went wrong: {this.props.error.message}</Alert> : false }
        </Row>
      </div>
    );
  }
}

export const AddTemplate = connect(
  function mapStateToProps(state) {
    return state.manageMatrices.template;
  },
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(actions, dispatch)
    };
  }
)(AddTemplateComponent);
