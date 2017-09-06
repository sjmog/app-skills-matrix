import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row } from 'react-bootstrap';
import { actions } from '../../../modules/admin/matrices';
import SaveEntityForm from './SaveEntityForm';

type SaveTemplateComponentProps = {
  actions: typeof actions,
  success: boolean,
  error: ErrorMessage,
};

class SaveTemplateComponent extends React.Component<SaveTemplateComponentProps, any> {
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
    // TODO: handle error (Need to decide if this feature is even valuable to maintain)
    this.props.actions.addTemplate(JSON.parse(this.state.template));
  }

  render() {
    return (
      <div>
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
  state => state.matrices.templateAddResult || {},
  dispatch => ({
    actions: bindActionCreators(actions, dispatch),
  }),
)(SaveTemplateComponent);
