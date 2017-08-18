import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Alert } from 'react-bootstrap';

import { actions, MatricesState } from '../../../modules/admin/matrices';

import TemplatePageHeader from './TemplatePageHeader';
import Matrix from '../matrix/Matrix';

type TemplatePageComponentProps = MatricesState &
  {
    actions: typeof actions,
    params: {
      templateId: string,
    },
  };

class TemplatePageComponent extends React.Component<TemplatePageComponentProps, void> {
  constructor(props) {
    super(props);
    this.onModifySkill = this.onModifySkill.bind(this);
  }

  onModifySkill(skill: UnhydratedTemplateSkill) {
    this.props.actions.saveSkills([skill]);
  }

  componentWillMount() {
    if (!this.props.templateFetchResult || this.props.templateFetchResult.template.id !== this.props.params.templateId) {
      this.props.actions.retrieveTemplate(this.props.params.templateId);
    }
  }

  render() {
    if (!this.props.templateFetchResult || this.props.templateFetchResult.template.id !== this.props.params.templateId) {
      return false;
    }

    const { template, skills, success, error } = this.props.templateFetchResult;

    if (success) {
      return (
        <div>
          <TemplatePageHeader
            templateName={template.name}
          />
          <Row>
            <Matrix
              categories={template.categories}
              levels={template.levels}
              skillGroups={template.skillGroups}
              skills={skills}
              onModifySkill={this.onModifySkill}
            />
          </Row>
        </div>
      );
    }

    return (<Row>{error ? <Alert bsStyle="danger">Something went wrong: {error.message}</Alert> : false}</Row>);
  }
}

export const
  TemplatePage = connect(
    state => state.matrices,
    dispatch => ({
      actions: bindActionCreators(actions, dispatch),
    }),
  )(TemplatePageComponent);
