import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Panel, Alert } from 'react-bootstrap';
import _find from 'lodash/find';
import R from 'ramda';

import { actions } from '../../../modules/user/manageEvaluation';

import './matrix.scss'

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
        <Row><h2 className="header">{template.name}</h2></Row>
        {
          template.levels.map((levelName, index) => {
            const isTopLevel = index === 0;

            const level = template.categories.map(
              (categoryName) => {
                const skillGroup = getSkillGroup(levelName, categoryName, skillGroups);

                return (
                  <Col sm={4} md={3} key={`${levelName}-${categoryName}`}>
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
                <Col sm={2} md={2} className={isTopLevel? 'level-label--bottom' : false}>
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
