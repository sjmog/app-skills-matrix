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

class SaveSkillComponent extends React.Component<SaveSkillComponentProps, { skill: string, error?: ErrorMessage, success: boolean }> {
  constructor(props) {
    super(props);
    this.state = { skill: '', error: null, success: false };

    this.updateSkillState = this.updateSkillState.bind(this);
    this.saveSkills = this.saveSkills.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!!nextProps.error) {
      this.setState({ error: nextProps.error, success: false });
    } else if (nextProps.success) {
      this.setState({ error: null, success: true });
    }
  }

  updateSkillState(e) {
    return this.setState({ skill: e.target.value });
  }

  saveSkills(e) {
    e.preventDefault();
    try {
      const skills: UnhydratedTemplateSkill | UnhydratedTemplateSkill[] = JSON.parse(this.state.skill);
      this.props.actions.saveSkills([].concat(skills));
    } catch (ex) {
      this.setState({ error: { message: ex.message } });
    }
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
          saveEntity={this.saveSkills}
          updateEntityInLocalState={this.updateSkillState}
          success={this.state.success}
          error={this.state.error}
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
