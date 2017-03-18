import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Alert } from 'react-bootstrap';

import { actions } from '../../../modules/user/evaluation';

import EvaluationPageHeader from './EvaluationPageHeader';
import Matrix from './matrix/Matrix';
import './evaluation.scss'

class EvaluationPageComponent extends React.Component {
  componentWillMount() {
    if (!this.props.evaluation.retrieved) {
      this.props.actions.retrieveEvaluation(this.props.params.evaluationId);
    }
  }

  render() {
    const { error } = this.props.evaluation;

    if (this.props.evaluation.retrieved && !error) {
      const { evaluation, template, skillGroups, skills } = this.props;
      const [ firstCategory ] = template.categories;

      return (
        <div>
          <EvaluationPageHeader
            templateName={template.name}
            firstCategory={firstCategory}
            id={this.props.params.evaluationId}
            status={evaluation.status}
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
      )
    }

    return (<Row>{error ? <Alert bsStyle='danger'>Something went wrong: {error.message}</Alert> : false}</Row>);
  }
}

EvaluationPageComponent.propTypes = {
  evaluation: PropTypes.object,
  template: PropTypes.object,
  skillGroups: PropTypes.object,
  skills: PropTypes.object,
  params: PropTypes.shape({
    evaluationId: PropTypes.string.isRequired
  })
};

export const EvaluationPage = connect(
  function mapStateToProps(state) {
    return state.evaluation;
  },
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(actions, dispatch)
    };
  }
)(EvaluationPageComponent);
