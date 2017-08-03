import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row } from 'react-bootstrap';
import { actions } from '../../../modules/admin/matrices';
import SaveEntityForm from './SaveEntityForm';

type SaveSkillComponentProps = {
  actions: typeof actions,
  success: boolean,
  error: ErrorMessage,
};

class SaveSkillComponent extends React.Component<SaveSkillComponentProps, { skill: string }> {
  constructor(props) {
    super(props);
    this.state = { skill: '' };

    this.updateSkillState = this.updateSkillState.bind(this);
    this.saveSkill = this.saveSkill.bind(this);
  }

  updateSkillState(e) {
    return this.setState({ skill: e.target.value });
  }

  saveSkill(e) {
    e.preventDefault();
    this.props.actions.saveSkill(this.state.skill);
  }

  render() {
    return (
      <div>
        <Row>
          <h2 className="header">New skill(s)</h2>
        </Row>
        <SaveEntityForm
          entityName="skill"
          entity={this.state.skill}
          saveEntity={this.saveSkill}
          updateEntityInLocalState={this.updateSkillState}
          success={this.props.success}
          error={this.props.error}
        />
      </div>
    );
  }
}

export const SaveSkill = connect(
  state => state.matrices.skillResult || {},
  dispatch => ({
    actions: bindActionCreators(actions, dispatch),
  }),
)(SaveSkillComponent);
