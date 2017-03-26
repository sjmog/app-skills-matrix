import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Alert } from 'react-bootstrap';

import { actions, SKILL_STATUS } from '../../../modules/user/evaluation';

import EvaluationPageHeader from './EvaluationPageHeader';
import Matrix from '../../common/matrix/Matrix';

import './evaluation.scss'

class EvaluationPageComponent extends React.Component {
  constructor(props) {
    super(props);
    this.updateSkillStatus = this.updateSkillStatus.bind(this);
    this.evaluationComplete = this.evaluationComplete.bind(this);
  }

  componentWillMount() {
    if (!this.props.evaluation.retrieved) {
      this.props.actions.retrieveEvaluation(this.props.params.evaluationId);
    }
  }

  updateSkillStatus(skillId, currentStatus) {
    const newStatus = currentStatus !== SKILL_STATUS.ATTAINED ? SKILL_STATUS.ATTAINED : null;
    this.props.actions.updateSkillStatus(this.props.params.evaluationId, skillId, newStatus);
  };

  evaluationComplete() {
    this.props.actions.evaluationComplete(this.props.params.evaluationId);
  }

  render() {
    const { error } = this.props.evaluation;

    if (this.props.evaluation.retrieved && !error) {
      const { evaluation, template, skillGroups, skills, user } = this.props;
      const [ firstCategory ] = template.categories;

      return (
        <div>
          <EvaluationPageHeader
            view={this.props.view}
            templateName={template.name}
            userName={user.name}
            firstCategory={firstCategory}
            id={this.props.params.evaluationId}
            status={evaluation.status}
            evaluationComplete={this.evaluationComplete}
          />
          <Row>
            <Matrix
              categories={template.categories}
              levels={template.levels}
              skillGroups={skillGroups}
              skills={skills}
              updateSkillStatus={this.updateSkillStatus}
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
