import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import R from 'ramda';
import { Grid, Col, Row, Alert } from 'react-bootstrap';
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
    const { templateName, levels, categories, skills, skillGroups, view, skillsInCategory, status, params, lowestUnevaluatedSkill, nextCategory } = this.props;

    this.state = {
      currentSkill: lowestUnevaluatedSkill,
      indexOfCurrentSkill: getIndexOfSkill(lowestUnevaluatedSkill.id, skillsInCategory),
      skillsInCategory,
      currentCategory: params.category,
      indexOfCurrentCategory: categories.indexOf(params.category),
      nextCategory,
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
    this.navigatePostSkillUpdate = this.navigatePostSkillUpdate.bind(this);
    this.nextSkill = this.nextSkill.bind(this);
    this.prevSkill = this.prevSkill.bind(this);
    this.evaluationComplete = this.evaluationComplete.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      const { category: currentCategory } = nextProps.params;
      const { skillsInCategory, lowestUnevaluatedSkill, nextCategory } = this.props;
      const indexOfLowestUnevaluatedSkill = getIndexOfSkill(lowestUnevaluatedSkill.id, skillsInCategory);
      const indexOfCurrentSkill = getIndexOfSkill(this.state.currentSkill.id, skillsInCategory);

      this.setState({
        currentSkill: indexOfCurrentSkill >= 0 ? skillsInCategory[indexOfCurrentSkill] : lowestUnevaluatedSkill,
        indexOfCurrentSkill: indexOfCurrentSkill >= 0 ? indexOfCurrentSkill : indexOfLowestUnevaluatedSkill,
        skillsInCategory,
        currentCategory: currentCategory,
        indexOfCurrentCategory: this.categories.indexOf(currentCategory),
        nextCategory,
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

  navigatePostSkillUpdate() {
    const isLastSkillInCategory = this.state.indexOfCurrentSkill + 1 === this.state.skillsInCategory.length;
    const isLastCategory = this.state.indexOfCurrentCategory + 1 === this.categories.length;

    if (isLastSkillInCategory && !isLastCategory) {
      this.props.router.push(`evaluations/${this.evaluationId}/category/${this.state.nextCategory}`)
    } else if (!isLastSkillInCategory) {
      this.nextSkill();
    }
  }
  updateSkillStatus(evaluationView) {
    return (skillId, newStatus) => this.props.actions.updateSkillStatus(evaluationView, this.evaluationId, skillId, newStatus);
  }

  evaluationComplete(evaluationId) {
    this.props.actions.evaluationComplete(evaluationId);
  }

  render() {
    const currentLevel = this.skillGroups[this.state.currentSkill.skillGroupId].level;

    return (
      <Grid>
        { this.props.erringSkills
          ? <Row>
            {this.props.erringSkills.map(
              ({ name }) =>
                <Alert bsStyle='danger' key={name}>
                  {`There was a problem updating a skill: ${name}`}
                </Alert>
            )}
          </Row>
          : false
        }
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
          <Col md={7} className='evaluation-panel'>
            <Skill
              level={currentLevel}
              skill={this.skills[this.state.currentSkill.id]}
              updateSkillStatus={this.updateSkillStatus(this.view)}
              navigatePostSkillUpdate={this.navigatePostSkillUpdate}
              nextSkill={this.nextSkill}
              prevSkill={this.prevSkill}
              isFirstSkill={this.state.indexOfCurrentSkill === 0}
              isLastSkill={this.state.indexOfCurrentSkill + 1 === this.state.skillsInCategory.length}
            />
          </Col>
          <Col md={5} className='evaluation-panel'>
            <Matrix
              skillBeingEvaluated={this.state.currentSkill.id}
              categories={[].concat(this.props.params.category)}
              levels={this.levels.slice(getIndexOfLevel(currentLevel, this.levels), this.levels.length)}
              skillGroups={this.skillGroups}
              updateSkillStatus={this.updateSkillStatus(this.view)}
              canUpdateSkillStatus={
                this.view === SUBJECT && this.evaluationStatus === NEW
                || this.view === MENTOR && this.evaluationStatus === SELF_EVALUATION_COMPLETE
              }
              skills={this.skills}
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
      lowestUnevaluatedSkill: selectors.getLowestUnevaluatedSkill(state, params.category),
      erringSkills: selectors.getErringSkills(state),
      nextCategory: selectors.getNextCategory(state, params.category),
    });
  },
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(actions, dispatch)
    };
  }
)(EvaluationCategoryComponent);
