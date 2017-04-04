import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import R from 'ramda';
import { Grid, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router';

import * as selectors from '../../../../modules/user'
import { actions, SKILL_STATUS, EVALUATION_VIEW, EVALUATION_STATUS } from '../../../../modules/user/evaluation';
const { SUBJECT, MENTOR } = EVALUATION_VIEW;
const { NEW, SELF_EVALUATION_COMPLETE } = EVALUATION_STATUS;

import CategoryPageHeader from './CategoryPageHeader';
import Matrix from '../../../common/matrix/Matrix'
import Skill from './Skill';

const getIndexOfSkill = (id, skillsInCategory) => R.findIndex(R.propEq('id', id))(skillsInCategory);
const getIndexOfLevel = (level, levels) => levels.indexOf(level);

class EvaluationCategoryComponent extends React.Component {
  constructor(props) {
    super(props);
    const { templateName, levels, categories, skills, skillGroups, view, skillsInCategory, status, params } = this.props;

    this.state = {
      currentSkill: skillsInCategory[0],
      indexOfCurrentSkill: 0,
      skillsInCategory,
      currentCategory: params.category,
      indexOfCurrentCategory: categories.indexOf(params.category),
    };

    this.templateName = templateName;
    this.view = view;
    this.evaluationStatus = status;
    this.evaluationId = params.evaluationId;
    this.levels = levels;
    this.categories = categories;
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
      const { skillsInCategory } = this.props;
      const indexOfCurrentSkill = getIndexOfSkill(this.state.currentSkill.id, skillsInCategory);

      this.setState({
        currentSkill: indexOfCurrentSkill >= 0 ? skillsInCategory[indexOfCurrentSkill] : skillsInCategory[0],
        indexOfCurrentSkill: indexOfCurrentSkill >= 0 ? indexOfCurrentSkill : 0,
        skillsInCategory,
        currentCategory: currentCategory,
        indexOfCurrentCategory: this.categories.indexOf(currentCategory),
      });
    }
  }

  nextSkill() {
    this.setState({
      currentSkill: this.state.skillsInCategory[this.state.indexOfCurrentSkill + 1],
      indexOfCurrentSkill: this.state.indexOfCurrentSkill + 1
    })
  };

  prevSkill() {
    this.setState({
      currentSkill: this.state.skillsInCategory[this.state.indexOfCurrentSkill - 1],
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
    const currentLevel = this.skillGroups[this.state.currentSkill.skillGroupId].level;

    return (
      <Grid>
        <Row>
          <CategoryPageHeader
            evaluationId={this.evaluationId}
            currentCategory={this.props.params.category}
            templateName={this.templateName}
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
              level={currentLevel}
              skill={this.skills[this.state.currentSkill.id]}
              updateSkillStatus={this.updateSkillStatus}
              nextSkill={this.nextSkill}
              prevSkill={this.prevSkill}
              isFirstSkill={this.state.indexOfCurrentSkill === 0}
              isLastSkill={this.state.indexOfCurrentSkill + 1 === this.state.skillsInCategory.length}
            />
          </Col>
          <Col md={5} className='matrix-panel'>
            <Matrix
              skillBeingEvaluated={this.state.currentSkill.id}
              categories={[].concat(this.props.params.category)}
              levels={this.levels.slice(getIndexOfLevel(currentLevel, this.levels), this.levels.length)}
              skillGroups={this.skillGroups}
              skills={this.skills}
              updateSkillStatus={this.updateSkillStatus}
              canUpdateSkillStatus={
                this.view === SUBJECT && this.evaluationStatus === NEW
                || this.view === MENTOR && this.evaluationStatus === SELF_EVALUATION_COMPLETE
              }
            />
          </Col>
        </Row>
      </Grid>
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
  skillGroups: PropTypes.object.isRequired,
  skillsInCategory: PropTypes.array.isRequired,
};

export const EvaluationCategoryPage = connect(
  function mapStateToProps(state, { params }) {
    return ({
      templateName: selectors.getTemplateName(state),
      levels: selectors.getLevels(state),
      categories: selectors.getCategories(state),
      skills: selectors.getSkills(state),
      skillGroups: selectors.getSkillGroups(state),
      status: selectors.getEvaluationStatus(state),
      view: selectors.getView(state),
      skillsInCategory: selectors.getAllSkillsInCategory(state, params.category),
    });
  },
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(actions, dispatch)
    };
  }
)(EvaluationCategoryComponent);
