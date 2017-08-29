import * as React from 'react';
import * as R from 'ramda';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Alert, Col } from 'react-bootstrap';

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
    this.onReplaceSkill = this.onReplaceSkill.bind(this);
    this.onRemoveSkill = this.onRemoveSkill.bind(this);
  }

  onAddSkill(template, level, category, existingSkillId) {
    this.props.actions.addSkillToTemplate(level, category, template, existingSkillId);
  }

  onModifySkill(skill: UnhydratedTemplateSkill) {
    this.props.actions.saveSkills([skill]);
  }

  onReplaceSkill(template, level: string, category: string, skill: UnhydratedTemplateSkill) {
    this.props.actions.replaceSkill(level, category, template, skill);
  }

  onRemoveSkill(template, level: string, category: string, skill: UnhydratedTemplateSkill) {
    this.props.actions.removeSkill(level, category, template, skill);
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
        <div className="evaluation-grid">
          <div className="evaluation-grid__item">
            <TemplatePageHeader templateName={template.name}/>
          </div>
          <div className="evaluation-grid__item">
            <Row>
              <Col md={20}>
                <Matrix
                  categories={template.categories}
                  levels={template.levels}
                  skillGroups={template.skillGroups}
                  skills={skills}
                  onModifySkill={this.onModifySkill}
                  onReplaceSkill={R.curry(this.onReplaceSkill)(template)}
                  onRemoveSkill={R.curry(this.onRemoveSkill)(template)}
                  onAddSkill={R.curry(this.onAddSkill)(template)}
                />
              </Col>
            </Row>
          </div>
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
