import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Alert } from 'react-bootstrap';

import { actions, SKILL_STATUS, EVALUATION_VIEW, EVALUATION_STATUS } from '../../../modules/user/evaluation';
const { SUBJECT, MENTOR } = EVALUATION_VIEW;
const { NEW, SELF_EVALUATION_COMPLETE } = EVALUATION_STATUS;

import EvaluationPageHeader from './EvaluationPageHeader';
import Matrix from '../../common/matrix/Matrix';

import './evaluation.scss'

class EvaluationPageComponent extends React.Component {
  constructor(props) {
    super(props);

    this.updateSkillStatus = this.updateSkillStatus.bind(this);

    this.evaluationId = this.props.params.evaluationId;
  }

  componentWillMount() {
    if (!this.props.evaluation.retrieved) {
      this.props.actions.retrieveEvaluation(this.evaluationId);
    }
  }

  updateSkillStatus(skillId, currentStatus) {
    const newStatus = currentStatus !== SKILL_STATUS.ATTAINED ? SKILL_STATUS.ATTAINED : null;
    this.props.actions.updateSkillStatus(this.evaluationId, skillId, newStatus);
  };

  render() {
    const { error } = this.props.evaluation;

    if (this.props.evaluation.retrieved && !error) {
      const { evaluation, template, skillGroups, skills, user, view } = this.props;
      const [ firstCategory ] = template.categories;

      return (
        <div>
          <EvaluationPageHeader evaluationId={this.evaluationId} />
          <Row>
            <Matrix
              categories={template.categories}
              levels={template.levels}
              skillGroups={skillGroups}
              skills={skills}
              updateSkillStatus={this.updateSkillStatus}
              canUpdateSkillStatus={
                view === SUBJECT && evaluation.status === NEW
                || view === MENTOR && evaluation.status === SELF_EVALUATION_COMPLETE
              }
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
