import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Row, Alert, Col, Jumbotron, Button } from 'react-bootstrap';
import { Link } from 'react-router';

import * as selectors from '../../../modules/user';
import { actions, SKILL_STATUS, EVALUATION_VIEW, EVALUATION_STATUS, EVALUATION_FETCH_STATUS } from '../../../modules/user/evaluation';
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
    const { levels, categories, status, skillGroups, skills, view, error, params, nextCategory, templateName, fetchStatus } = this.props;
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

    if (fetchStatus !== EVALUATION_FETCH_STATUS.LOADED) {
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
  function mapStateToProps(state, props) {
    const evalId = props.params.evaluationId;

    return ({
      error: selectors.getError(state, evalId),
      fetchStatus: selectors.getEvaluationFetchStatus(state, evalId),
      status: selectors.getEvaluationStatus(state, evalId),
      templateName: selectors.getTemplateName(state, evalId),
      levels: selectors.getLevels(state, evalId),
      categories: selectors.getCategories(state, evalId),
      skillGroups: selectors.getSkillGroups(state, evalId),
      skills: selectors.getSkills(state, evalId),
      view: selectors.getView(state, evalId),
      nextCategory: selectors.getNextCategory(state, null, evalId)
    });
  },
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(actions, dispatch)
    };
  }
)(EvaluationPageComponent);
