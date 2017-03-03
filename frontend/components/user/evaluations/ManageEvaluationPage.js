import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Panel, Alert, Button } from 'react-bootstrap';
import _find from 'lodash/find';
import R from 'ramda';

import { actions } from '../../../modules/user/manageEvaluation';

import './evaluation.scss'

const getSkillGroup = (level, category, skillGroups) =>
  _find(skillGroups,
    (group => (group.level === level && group.category === category)));

class ManageEvaluationPageComponent extends React.Component {
  componentWillMount() {
    if (!this.props.evaluationRetrieved) {
      this.props.actions.retrieveEvaluation(this.props.params.evaluationId);
    }
  }

  render() {
    const { template, skillGroups, skills } = this.props;

    return this.props.evaluationRetrieved
      ? (
      <div>
        <Row>
          <h3 className='header'>{template.name}</h3>
          <Button bsStyle='primary' className='evaluation-btn' >{`Begin evaluation`}</Button>
        </Row>
        {
          template.levels.map((levelName, index) => {
            const isTopLevel = index === 0;

            const level = template.categories.map(
              (categoryName) => {
                const skillGroup = getSkillGroup(levelName, categoryName, skillGroups);

                return (
                  <Col sm={2} md={2} key={`${levelName}-${categoryName}`}>
                    { isTopLevel
                      ? (<h3>{categoryName}</h3>)
                      : false
                    }
                    {
                      skillGroup.skills.map((skillId) => {
                        const { name, status } =  skills[skillId];
                        const achieved = (status && status === 'achieved');

                        return (
                          <Panel className={achieved ? 'skill--blue' : false } key={skillId}>
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
                <Col sm={1} md={1} className={isTopLevel? 'level-label' : false}>
                  { <h3 className='header'>{levelName}</h3> }
                </Col>
                {level}
              </Row>
            );
          })
        }
      </div>
    )
      :
      (
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
  template: PropTypes.object,
  skillGroups: PropTypes.object,
  skills: PropTypes.object,
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
