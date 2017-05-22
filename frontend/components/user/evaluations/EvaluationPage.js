import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Row, Alert, Col, Jumbotron, Button } from 'react-bootstrap';
import { Link } from 'react-router';

import * as selectors from '../../../modules/user';
import { actions, SKILL_STATUS, EVALUATION_VIEW, EVALUATION_STATUS } from '../../../modules/user/evaluation';
const { SUBJECT, MENTOR, ADMIN } = EVALUATION_VIEW;
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

  componentDidMount() {
    this.props.actions.retrieveEvaluation(this.evaluationId)
  }

  updateSkillStatus(evaluationView) {
    return (skillId, newStatus) => this.props.actions.updateSkillStatus(evaluationView, this.evaluationId, skillId, newStatus);
  }

  render() {
    const { levels, categories, status, skillGroups, skills, view, error, evaluationInState, params, nextCategory, templateName } = this.props;
    const { evaluationId } = params;

    if (error) {
      return (
        <Grid>
          <Row>
            <Alert bsStyle='danger'>Something went wrong: {error.message}</Alert>
          </Row>
        </Grid>
      );
    }

    if (evaluationInState !== evaluationId) {
      return false;
    }

    if (view === SUBJECT && status === NEW) {
      return (
        <Grid>
          <Jumbotron>
            <p>{`Are you ready to start your ${templateName} evaluation?`}</p>
            <Link to={`/evaluations/${evaluationId}/category/${nextCategory || categories[0]}`}>
              <Button bsStyle="primary" bsSize="large">Start evaluation</Button>
            </Link>
          </Jumbotron>
        </Grid>
      );
    }

    return (
      <div className='evaluation-grid'>
        <div className='evaluation-grid__item'>
          <EvaluationPageHeader
            evaluationId={this.evaluationId}
            router={this.props.router}
          />
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
                  view === ADMIN
                  || view === SUBJECT && status === NEW
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
    const evaluationInState = selectors.getIdOfEvaluationInState(state);
    const error = selectors.getError(state);

    if (!evaluationInState || error) {
      return ({
        evaluationInState,
        error
      })
    }

    return ({
      evaluationInState,
      status: selectors.getEvaluationStatus(state),
      templateName: selectors.getTemplateName(state),
      levels: selectors.getLevels(state),
      categories: selectors.getCategories(state),
      skillGroups: selectors.getSkillGroups(state),
      skills: selectors.getSkills(state),
      view: selectors.getView(state),
      nextCategory: selectors.getNextCategory(state)
    });
  },
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(actions, dispatch)
    };
  }
)(EvaluationPageComponent);
