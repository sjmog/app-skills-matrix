import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row } from 'react-bootstrap';
import { actions } from '../../../modules/admin/matrices';
import SaveEntityForm from './SaveEntityForm';

class SaveTemplateComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { template: '' };

    this.updateTemplateState = this.updateTemplateState.bind(this);
    this.saveTemplate = this.saveTemplate.bind(this);
  }

  updateTemplateState(e) {
    return this.setState({ template: e.target.value });
  }

  saveTemplate(e) {
    e.preventDefault();
    this.props.actions.saveTemplate(this.state.template);
  }

  render() {
    return (
      <div>
        <Row>
          <h2 className="header">New template</h2>
        </Row>
        <SaveEntityForm
          entityName="template"
          entity={this.state.template}
          saveEntity={this.saveTemplate}
          updateEntityInLocalState={this.updateTemplateState}
          success={this.props.success}
          error={this.props.error}
        />
      </div>
    );
  }
}

export const SaveTemplate = connect(
  state => state.matrices.templateResult || {},
  dispatch => ({
    actions: bindActionCreators(actions, dispatch),
  }),
)(SaveTemplateComponent);
