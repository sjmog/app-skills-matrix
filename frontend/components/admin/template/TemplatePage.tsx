import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Alert } from 'react-bootstrap';

import { actions } from '../../../modules/admin/matrices';

import TemplatePageHeader from './TemplatePageHeader';
import Matrix from '../../common/matrix/Matrix';

// todo: fix types
type TemplatePageComponentProps = {
  templateResult: any,
  template: any,
  skillGroups: any,
  skills: any,
  retrieved: boolean,
  actions: any,
  params: {
    templateId: string,
  },
};

class TemplatePageComponent extends React.Component<TemplatePageComponentProps, any> {
  componentWillMount() {
    if (!this.props.retrieved) {
      this.props.actions.retrieveTemplate(this.props.params.templateId);
    }
  }

  render() {
    const { template, skillGroups, skills, templateResult } = this.props;
    const { success, error }: { success?: boolean, error?: { message: string } } = templateResult || {};

    if (this.props.retrieved && success) {
      const [firstCategory] = template.categories;

      return (
        <div>
          <TemplatePageHeader
            templateName={template.name}
          />
          <Row>
            <Matrix
              categories={template.categories}
              levels={template.levels}
              skillGroups={skillGroups}
              skills={skills}
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
