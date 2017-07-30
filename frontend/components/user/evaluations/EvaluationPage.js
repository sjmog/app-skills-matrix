import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Row, Alert, Col } from 'react-bootstrap';

import * as selectors from '../../../modules/user';
import { actionCreators, EVALUATION_VIEW, EVALUATION_STATUS, EVALUATION_FETCH_STATUS } from '../../../modules/user/evaluations';

import Evaluation from './evaluation/Evaluation';
import EvaluationPageHeader from './EvaluationPageHeader';
import Matrix from '../../common/matrix/Matrix';

import './evaluation.scss';

const { SUBJECT, MENTOR, ADMIN } = EVALUATION_VIEW;
const { NEW, SELF_EVALUATION_COMPLETE } = EVALUATION_STATUS;

class EvaluationPageComponent extends React.Component {
  constructor(props) {
    super(props);

    this.updateSkillStatus = this.updateSkillStatus.bind(this);
  }

  componentDidMount() {
    const { params: { evaluationId }, fetchStatus, actions } = this.props;

    if (!fetchStatus) {
      actions.retrieveEvaluation(evaluationId);
    }
  }

  updateSkillStatus(updateId, newSkillStatus, skillId) {
    const { actions, view, params: { evaluationId } } = this.props;

    return actions.updateSkillStatus(view, evaluationId, updateId, newSkillStatus, skillId);
  }

  render() {
    const { error, levels, categories, status, skillGroups, view, params: { evaluationId }, fetchStatus } = this.props;

    if (error) {
      return (
        <Grid>
          <Row>
            <Alert bsStyle="danger">Something went wrong: {error.message}</Alert>
          </Row>
        </Grid>
      );
    }

    if (fetchStatus !== EVALUATION_FETCH_STATUS.LOADED) {
      return false;
    }

    if (view === SUBJECT && status === NEW) {
      return (
        <Evaluation
          evaluationId={evaluationId}
          view={view}
          levels={levels}
          status={status}
          updateSkillStatus={this.updateSkillStatus}
        />
      );
    }

    return (
      <div className="evaluation-grid">
        <div className="evaluation-grid__item">
          <EvaluationPageHeader
            evaluationId={evaluationId}
          />
        </div>
        <div className="evaluation-grid__item">
          <Row>
            <h4>Legend</h4>
            <p className="skill--legend skill--attained state--icon--ATTAINED">Attained</p>
            <p className="skill--legend skill--newly-attained state--icon--ATTAINED">Newly attained</p>
            <p className="skill--legend skill--objective state--icon--OBJECTIVE">Objective</p>
            <p className="skill--legend skill--feedback state--icon--FEEDBACK">Feedback</p>
            <p className="skill--legend skill--not-attained state--icon--NOT_ATTAINED">Not attained</p>
          </Row>
          <Row>
            <Col md={20}>
              <Matrix
                categories={categories}
                levels={levels}
                skillGroups={skillGroups}
                updateSkillStatus={this.updateSkillStatus}
                canUpdateSkillStatus={
                  view === ADMIN
                  || (view === SUBJECT && status === NEW)
                  || (view === MENTOR && status === SELF_EVALUATION_COMPLETE)
                }
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

EvaluationPageComponent.propTypes = {
  status: PropTypes.string,
  levels: PropTypes.array,
  categories: PropTypes.array,
  skillGroups: PropTypes.object,
  view: PropTypes.string,
  error: PropTypes.object,
  params: PropTypes.shape({
    evaluationId: PropTypes.string.isRequired,
  }),
};

export const EvaluationPage = connect(
  (state, props) => {
    const evalId = props.params.evaluationId;

    return ({
      error: selectors.getError(state, evalId),
      fetchStatus: selectors.getEvaluationFetchStatus(state, evalId),
      status: selectors.getEvaluationStatus(state, evalId),
      levels: selectors.getLevels(state, evalId),
      categories: selectors.getCategories(state, evalId),
      skillGroups: selectors.getSkillGroups(state, evalId),
      view: selectors.getView(state, evalId),
    });
  },
  dispatch => ({
    actions: bindActionCreators(actionCreators, dispatch),
  }),
)(EvaluationPageComponent);
