import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Form, FormGroup, FormControl, ControlLabel, Radio, Button, Glyphicon, Alert } from 'react-bootstrap';
import { actions } from '../../modules/manageMatrices';

class AddSkillComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { skill: '' };

    this.updateNewSkillState = this.updateNewSkillState.bind(this);
    this.onAddSkill = this.onAddSkill.bind(this);
  }

  updateNewSkillState(e) {
    return this.setState({ skill: e.target.value });
  }

  onAddSkill(e) {
    e.preventDefault();
    this.props.actions.addSkill(this.state.skill)
  }

  render() {
    return (
      <div>
        <Row>
          <h2 className="header">New skill</h2>
        </Row>
        <Row className='show-grid'>
          <Form onSubmit={this.onAddSkill}>
            <FormGroup>
              <ControlLabel>Paste your JSON here</ControlLabel>
              <FormControl
                componentClass="textarea"
                name='skill'
                value={this.state.skill}
                onChange={this.updateNewSkillState}
              />
            </FormGroup>
            {' '}
            <Button bsStyle='primary' type="submit"><Glyphicon glyph='upload' /></Button>
          </Form>
        </Row>
        <Row>
          { this.props.success
            ? <Alert bsStyle='success'>Skill successfully added</Alert>
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

export const AddSkill = connect(
  function mapStateToProps(state) {
    return state.manageMatrices.skill;
  },
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(actions, dispatch)
    };
  }
)(AddSkillComponent);
