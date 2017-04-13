import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Alert, Col } from 'react-bootstrap';

import * as selectors from '../../../modules/user';
import { actions, SKILL_STATUS, EVALUATION_VIEW, EVALUATION_STATUS } from '../../../modules/user/evaluation';
const { SUBJECT, MENTOR } = EVALUATION_VIEW;
const { NEW, SELF_EVALUATION_COMPLETE } = EVALUATION_STATUS;

import EvaluationPageHeader from './EvaluationPageHeader';
import Matrix from '../../common/matrix/Matrix';

import './evaluation.scss'

class EvaluationPageComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      evaluationRetrieved: false
    };

    this.updateSkillStatus = this.updateSkillStatus.bind(this);
    this.evaluationId = this.props.params.evaluationId;
  }

  componentWillMount() {
    this.props.actions.retrieveEvaluation(this.evaluationId)
      .then(() => this.setState({ evaluationRetrieved: true }))
  }

  updateSkillStatus(evaluationView) {
    return (skillId, newStatus) => this.props.actions.updateSkillStatus(evaluationView, this.evaluationId, skillId, newStatus);
  }

  render() {
    const { levels, categories, status, skillGroups, skills, view, error } = this.props;

    if (!this.state.evaluationRetrieved) {
      return false;
    }

    if (error) {
      return <Row>{error ? <Alert bsStyle='danger'>Something went wrong: {error.message}</Alert> : false}</Row>;
    }

    return (
      <div className='evaluation-grid'>
        <div className='evaluation-grid__item'>
          <EvaluationPageHeader evaluationId={this.evaluationId}/>
        </div>
        <div className='evaluation-grid__item'>
        <Row>
          <Col md={20}>
          <Matrix
            categories={categories}
            levels={levels}
            skillGroups={skillGroups}
            skills={skills}
            updateSkillStatus={this.updateSkillStatus(view)}
            canUpdateSkillStatus={
              view === SUBJECT && status === NEW
              || view === MENTOR && status === SELF_EVALUATION_COMPLETE
            }
          />
          </Col>
        </Row>
        </div>
      </div>
    )
  }
}

EvaluationPageComponent.propTypes = {
  status: PropTypes.string,
  levels: PropTypes.array,
  categories: PropTypes.array,
  skillGroups: PropTypes.object,
  skills: PropTypes.object,
  view: PropTypes.string,
  error: PropTypes.object,
  params: PropTypes.shape({
    evaluationId: PropTypes.string.isRequired
  })
};

export const EvaluationPage = connect(
  function mapStateToProps(state) {
    return ({
      status: selectors.getEvaluationStatus(state),
      levels: selectors.getLevels(state),
      categories: selectors.getCategories(state),
      skillGroups: selectors.getSkillGroups(state),
      skills: selectors.getSkills(state),
      view: selectors.getView(state),
      error: selectors.getError(state),
    });
  },
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(actions, dispatch)
    };
  }
)(EvaluationPageComponent);
