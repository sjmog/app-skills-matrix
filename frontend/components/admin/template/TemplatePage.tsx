import * as React from 'react';
import * as R from 'ramda';
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
    this.onAddSkill = this.onAddSkill.bind(this);
  }

  onAddSkill(template, level, category) {
    this.props.actions.addSkillToTemplate(level, category, template);
  }

  onModifySkill(skill: UnhydratedTemplateSkill) {
    this.props.actions.saveSkills([skill]);
  }

  onReplaceSkill(level: string, category: string, skill: UnhydratedTemplateSkill) {
    // TODO do something
    console.log(level, category);
  }

  componentWillMount() {
    if (!this.props.templateFetchResult || this.props.templateFetchResult.template.id !== this.props.params.templateId) {
      this.props.actions.retrieveTemplate(this.props.params.templateId);
    }
  }

  render() {
    if (!this.props.templateFetchResult) {
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
              onReplaceSkill={this.onReplaceSkill}
              onAddSkill={R.curry(this.onAddSkill)(template)}
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
