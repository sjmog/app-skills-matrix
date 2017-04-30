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
import Matrix from '../../../common/matrix/Matrix';
import Skill from './Skill';

const getIndexOfSkill = (id, skillsInCategory) => R.findIndex(R.propEq('id', id))(skillsInCategory);
const getIndexOfLevel = (level, levels) => levels.indexOf(level);

class EvaluationCategoryComponent extends React.Component {
  constructor(props) {
    super(props);

    this.updateSkillStatus = this.updateSkillStatus.bind(this);
    this.navigatePostSkillUpdate = this.navigatePostSkillUpdate.bind(this);
    this.nextSkill = this.nextSkill.bind(this);
    this.prevSkill = this.prevSkill.bind(this);
    this.evaluationComplete = this.evaluationComplete.bind(this);
  }

  componentDidMount() {
    this.props.actions.retrieveEvaluation(this.props.params.evaluationId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.evaluationInState === nextProps.params.evaluationId && nextProps !== this.props && !nextProps.error) {
      const { category: currentCategory } = nextProps.params;
      const { categories, skillsInCategory, lowestUnevaluatedSkill, nextCategory } = nextProps;

      const currentSkill = this.state && getIndexOfSkill(this.state.currentSkill.id, skillsInCategory) >= 0
        ? this.state.currentSkill
        : lowestUnevaluatedSkill;

      this.setState({
        currentSkill,
        indexOfCurrentSkill: getIndexOfSkill(currentSkill.id, skillsInCategory),
        skillsInCategory,
        currentCategory: currentCategory,
        indexOfCurrentCategory: categories.indexOf(currentCategory),
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
    const { indexOfCurrentSkill, skillsInCategory, nextCategory } = this.state;
    const { skills, params, router } = this.props;

    const remainingSkillsInCategory = R.slice(indexOfCurrentSkill, Infinity, skillsInCategory);
    const unevaluatedSkill = ({ id }) => skills[id].status.current === null;
    const nextUnevaluatedSkillInCategory = R.find(unevaluatedSkill)(remainingSkillsInCategory);

    if (!nextUnevaluatedSkillInCategory && nextCategory) {
      router.push(`evaluations/${params.evaluationId}/category/${nextCategory}`)
    } else if (nextUnevaluatedSkillInCategory) {
      this.setState({
        currentSkill: nextUnevaluatedSkillInCategory,
        indexOfCurrentSkill: skillsInCategory.indexOf(nextUnevaluatedSkillInCategory)
      })
    }
  }

  updateSkillStatus(evaluationView) {
    const { evaluationId } = this.props.params;
    return (skillId, newStatus) => this.props.actions.updateSkillStatus(evaluationView, evaluationId, skillId, newStatus);
  }

  evaluationComplete(evaluationId) {
    this.props.actions.evaluationComplete(evaluationId);
  }

  render() {
    const { error, evaluationInState, erringSkills, params, categories, levels, skills, skillGroups, view, status } = this.props;
    const { category, evaluationId } = params;

    if (error) {
      return (
        <Grid>
          <Row>{error ? <Alert bsStyle='danger'>Something went wrong: {error.message}</Alert> : false}</Row>
        </Grid>
      );
    }

    if (evaluationInState !== evaluationId || !this.state) {
      return false;
    }

    const currentLevel = skillGroups[this.state.currentSkill.skillGroupId].level;

    return (
      <Grid>
        { erringSkills
          ? <Row>
            {erringSkills.map(
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
            evaluationId={evaluationId}
            currentCategory={category}
            remainingCategories={categories.length - (this.state.indexOfCurrentCategory + 1)}
            isFirstCategory={this.state.indexOfCurrentCategory === 0}
            isLastCategory={this.state.indexOfCurrentCategory + 1 === categories.length}
            previousCategory={categories[this.state.indexOfCurrentCategory - 1]}
            nextCategory={categories[this.state.indexOfCurrentCategory + 1]}
            evaluationComplete={this.evaluationComplete}
            router={this.props.router}
          />
        </Row>
        <Row>
          <Col md={7} className='evaluation-panel'>
            <Skill
              level={currentLevel}
              skill={skills[this.state.currentSkill.id]}
              updateSkillStatus={this.updateSkillStatus(view)}
              navigatePostSkillUpdate={this.navigatePostSkillUpdate}
              nextSkill={this.nextSkill}
              prevSkill={this.prevSkill}
              isFirstSkill={this.state.indexOfCurrentSkill === 0}
              isLastSkill={this.state.indexOfCurrentSkill + 1 === this.state.skillsInCategory.length}
            />
          </Col>
          <Col md={5} className='evaluation-panel evaluation-panel--right'>
            <Matrix
              skillBeingEvaluated={this.state.currentSkill.id}
              categories={[].concat(category)}
              levels={levels.slice(getIndexOfLevel(currentLevel, levels), levels.length)}
              skillGroups={skillGroups}
              updateSkillStatus={this.updateSkillStatus(view)}
              canUpdateSkillStatus={
                view === SUBJECT && status === NEW
                || view === MENTOR && status === SELF_EVALUATION_COMPLETE
              }
              skills={skills}
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
  skills: PropTypes.object,
  skillGroups: PropTypes.object,
  skillsInCategory: PropTypes.array,
};

export const EvaluationCategoryPage = connect(
  function mapStateToProps(state, { params }) {
    const evaluationInState = selectors.getIdOfEvaluationInState(state);
    const error = selectors.getError(state);

    if (!evaluationInState || error) {
      return ({
        evaluationInState,
        error,
      })
    }

    return ({
      evaluationInState,
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
