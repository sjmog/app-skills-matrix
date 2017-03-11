import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Panel, Alert, Button } from 'react-bootstrap';
import R from 'ramda';
import { Link } from 'react-router';

import { actions } from '../../../modules/user/manageEvaluation';
import { getSkillGroup, statuses } from './helpers';

import './evaluation.scss'

class ManageEvaluationPageComponent extends React.Component {
  componentWillMount() {
    if (!this.props.evaluationRetrieved) {
      this.props.actions.retrieveEvaluation(this.props.params.evaluationId);
    }
  }

  render() {
    if (this.props.evaluationRetrieved) {
      const { template, skillGroups, skills } = this.props;
      const [ firstCategory ] = template.categories;

      return (
        <div>
          <Row>
            <h3 className='header'>{template.name}</h3>
            <Link to={`evaluations/${this.props.params.evaluationId}/category/${firstCategory}`}>
              <Button bsStyle='primary' className='header__button'>
                Begin evaluation
              </Button>
            </Link>
          </Row>
          {
            template.levels.map((levelName, index) => {
              const isTopLevel = (index === 0);

              const level = template.categories.map(
                (categoryName) => {
                  const skillGroup = getSkillGroup(levelName, categoryName, skillGroups);

                  return (
                    <Col md={2} key={`${levelName}-${categoryName}`}>
                      { isTopLevel ? <h3>{categoryName}</h3> : false }
                      {
                        skillGroup.skills.map((skillId) => {
                          const { name, status } =  skills[skillId];

                          return (
                            <Panel
                              className={status && status.current === statuses.ATTAINED ? 'panel--state-attained' : false }
                              key={skillId}>
                              {name}
                            </Panel>
                          )
                        })
                      }
                    </Col>
                  )
                }
              );

              return (
                <Row key={levelName}>
                  <Col md={1} className={isTopLevel? 'label--top' : false}>
                    { <h3 className='header'>{levelName}</h3> }
                  </Col>
                  {level}
                </Row>
              );
            })
          }
        </div>
      )
    }

    return (
      <Row>
        { this.props.error
          ? <Alert bsStyle='danger'>Something went wrong: {this.props.error.message}</Alert>
          : false
        }
      </Row>
    );
  }
}

ManageEvaluationPageComponent.propTypes = {
  evaluationRetrieved: PropTypes.bool.isRequired,
  template: PropTypes.object,
  skillGroups: PropTypes.object,
  skills: PropTypes.object,
  params: PropTypes.shape({
    evaluationId: PropTypes.string.isRequired
  })
};

export const ManageEvaluationPage = connect(
  function mapStateToProps(state) {
    return state.manageEvaluation;
  },
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(actions, dispatch)
    };
  }
)(ManageEvaluationPageComponent);
