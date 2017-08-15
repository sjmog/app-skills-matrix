import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Alert } from 'react-bootstrap';

import { actions } from '../../../modules/admin/matrices';

import TemplatePageHeader from './TemplatePageHeader';
import Matrix from '../matrix/Matrix';

type TemplatePageComponentProps = {
  templateResult: { success?: boolean, error?: ErrorMessage },
  template: NormalizedTemplateViewModel,
  skillGroups: SkillGroup[],
  skills: UnhydratedTemplateSkill[],
  retrieved: boolean,
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
    if (!this.props.retrieved) {
      this.props.actions.retrieveTemplate(this.props.params.templateId);
    }
  }

  render() {
    if (!this.props.retrieved) {
      return false;
    }

    const { template, skillGroups, skills, templateResult } = this.props;
    const { success, error } = templateResult;

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
              skillGroups={skillGroups}
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
