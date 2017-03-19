import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Alert } from 'react-bootstrap';

import { actions } from '../../../modules/admin/matrices';

import TemplatePageHeader from './TemplatePageHeader';
import Matrix from '../../common/matrix/Matrix';

import './template.scss'
import '../../common/matrix/matrix.scss'

class TemplatePageComponent extends React.Component {
  componentWillMount() {
    if (!this.props.retrieved) {
      this.props.actions.retrieveTemplate(this.props.params.templateId);
    }
  }

  render() {
    const { template, skillGroups, skills, templateResult } = this.props;
    const { success, error } = templateResult || {};

    if (this.props.retrieved && success) {
      const [firstCategory] = template.categories;

      return (
        <div>
          <TemplatePageHeader
            templateName={template.name}
            firstCategory={firstCategory}
            id={this.props.params.templateId}
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

    return (<Row>{error ? <Alert bsStyle='danger'>Something went wrong: {error.message}</Alert> : false}</Row>);
  }
}

TemplatePageComponent.propTypes = {
  templateResult: PropTypes.object,
  template: PropTypes.object,
  skillGroups: PropTypes.object,
  skills: PropTypes.object,
};

export const
  TemplatePage = connect(
    function mapStateToProps(state) {
      return state.matrices;
    },
    function mapDispatchToProps(dispatch) {
      return {
        actions: bindActionCreators(actions, dispatch)
      };
    }
  )(TemplatePageComponent);
