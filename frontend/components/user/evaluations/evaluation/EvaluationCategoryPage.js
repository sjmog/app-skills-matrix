import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import R from 'ramda';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router';

import { actions, SKILL_STATUS, EVALUATION_VIEW, EVALUATION_STATUS } from '../../../../modules/user/evaluation';
const { SUBJECT, MENTOR } = EVALUATION_VIEW;
const { NEW, SELF_EVALUATION_COMPLETE } = EVALUATION_STATUS;

import { getSkillGroup } from '../../../common/helpers';

import CategoryPageHeader from './CategoryPageHeader';
import Matrix from '../../../common/matrix/Matrix'
import Skill from './Skill';

const getAllSkillsInCategory = (category, levels, allSkills, skillGroups) =>
  R.flatten(
    R.reverse(levels).map((level) => {
      const { id: skillGroupId, skills } = getSkillGroup(level, category, skillGroups);
      return skills.map((id) => Object.assign({}, { id, skillGroupId }));
    }));

const getIndexOfSkill = (id, skillsInCategory) => R.findIndex(R.propEq('id', id))(skillsInCategory);

class EvaluationCategoryComponent extends React.Component {
  constructor(props) {
    super(props);
    const { template, skills, skillGroups, params, view, evaluation } = this.props;
    const allSkillsInCategory = getAllSkillsInCategory(params.category, template.levels, skills, skillGroups);

    this.state = {
      currentSkill: allSkillsInCategory[0],
      indexOfCurrentSkill: 0,
      allSkillsInCategory: allSkillsInCategory,
      currentCategory: params.category,
      indexOfCurrentCategory: template.categories.indexOf(params.category),
    };

    this.view = view;
    this.evaluation = evaluation;
    this.evaluationId = params.evaluationId;
    this.levels = template.levels;
    this.categories = template.categories;
    this.skills = skills;
    this.skillGroups = skillGroups;

    this.updateSkillStatus = this.updateSkillStatus.bind(this);
    this.nextSkill = this.nextSkill.bind(this);
    this.prevSkill = this.prevSkill.bind(this);
    this.evaluationComplete = this.evaluationComplete.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      const { category: currentCategory } = nextProps.params;
      const allSkillsInCategory = getAllSkillsInCategory(currentCategory, this.levels, this.skills, this.skillGroups);
      const indexOfCurrentSkill = getIndexOfSkill(this.state.currentSkill.id, allSkillsInCategory);

      this.setState({
        currentSkill: indexOfCurrentSkill >= 0 ? allSkillsInCategory[indexOfCurrentSkill] : allSkillsInCategory[0],
        indexOfCurrentSkill,
        allSkillsInCategory,
        currentCategory: currentCategory,
        indexOfCurrentCategory: this.categories.indexOf(currentCategory),
      });
    }
  }

  nextSkill() {
    this.setState({
      currentSkill: this.state.allSkillsInCategory[this.state.indexOfCurrentSkill + 1],
      indexOfCurrentSkill: this.state.indexOfCurrentSkill + 1
    })
  };

  prevSkill() {
    this.setState({
      currentSkill: this.state.allSkillsInCategory[this.state.indexOfCurrentSkill - 1],
      indexOfCurrentSkill: this.state.indexOfCurrentSkill - 1
    })
  }

  updateSkillStatus(skillId, currentStatus) {
    const newStatus = currentStatus !== SKILL_STATUS.ATTAINED ? SKILL_STATUS.ATTAINED : null;
    this.props.actions.updateSkillStatus(this.evaluationId, skillId, newStatus);
  };

  evaluationComplete(evaluationId) {
    this.props.actions.evaluationComplete(evaluationId);
  }

  render() {
    return (
      <div>
        <Row>
          <CategoryPageHeader
            evaluationId={this.evaluationId}
            currentCategory={this.props.params.category}
            templateName={this.props.template.name}
            isFirstCategory={this.state.indexOfCurrentCategory === 0}
            isLastCategory={this.state.indexOfCurrentCategory + 1 === this.categories.length}
            previousCategory={this.categories[this.state.indexOfCurrentCategory - 1]}
            nextCategory={this.categories[this.state.indexOfCurrentCategory + 1]}
            evaluationComplete={this.evaluationComplete}
          />
        </Row>
        <Row>
          <Col md={7} className='skill-panel'>
            <Skill
              level={this.skillGroups[this.state.currentSkill.skillGroupId].level}
              skill={this.skills[this.state.currentSkill.id]}
              updateSkillStatus={this.updateSkillStatus}
              nextSkill={this.nextSkill}
              prevSkill={this.prevSkill}
              isFirstSkill={this.state.indexOfCurrentSkill === 0}
              isLastSkill={this.state.indexOfCurrentSkill + 1 === this.state.allSkillsInCategory.length}
            />
          </Col>
          <Col md={5} className='matrix-panel'>
            <Matrix
              skillBeingEvaluated={this.state.currentSkill.id}
              categories={[].concat(this.props.params.category)}
              levels={[].concat(this.levels)}
              skillGroups={this.skillGroups}
              skills={this.skills}
              updateSkillStatus={this.updateSkillStatus}
              canUpdateSkillStatus={
                this.view === SUBJECT && this.evaluation.status === NEW
                || this.view === MENTOR && this.evaluation.status === SELF_EVALUATION_COMPLETE
              }
            />
          </Col>
        </Row>
      </div>
    )
  }
}

EvaluationCategoryComponent.propTypes = {
  params: PropTypes.shape({
    category: PropTypes.string.isRequired,
    evaluationId: PropTypes.string.isRequired
  }),
  template: PropTypes.shape({
    levels: PropTypes.array
  }),
  skills: PropTypes.object.isRequired,
  skillGroups: PropTypes.object.isRequired
};

export const EvaluationCategoryPage = connect(
  function mapStateToProps(state) {
    return state.evaluation;
  },
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(actions, dispatch)
    };
  }
)(EvaluationCategoryComponent);
