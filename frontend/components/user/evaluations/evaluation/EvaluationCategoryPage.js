import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import R from 'ramda';
import { Button, ButtonGroup, Glyphicon, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router';

import { actions, SKILL_STATUS } from '../../../../modules/user/evaluation';
import { getSkillGroup } from '../../../common/helpers';

import Matrix from '../../../common/matrix/Matrix'
import CategoryNav from './CategoryNav';
import Skill from './Skill';

const getAllSkillsInCategory = (category, levels, allSkills, skillGroups) =>
  R.flatten(
    levels.map((level) => {
      const { id: skillGroupId, skills } = getSkillGroup(level, category, skillGroups);
      return skills.map((id) => Object.assign({}, { id, skillGroupId }));
    }));

const getIndexOfSkill = (id, skillsInCategory) => R.findIndex(R.propEq('id', id))(skillsInCategory);

class EvaluationCategoryComponent extends React.Component {
  constructor(props) {
    super(props);
    const { template, skills, skillGroups, params } = this.props;
    const allSkillsInCategory = getAllSkillsInCategory(params.category, template.levels, skills, skillGroups);

    this.state = {
      currentSkill: allSkillsInCategory[0],
      indexOfCurrentSkill: 0,
      allSkillsInCategory: allSkillsInCategory,
      currentCategory: params.category,
      indexOfCurrentCategory: template.categories.indexOf(params.category),
    };

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

  updateSkillStatus(currentStatus) {
    const { skillGroupId, id } = this.state.currentSkill;
    const newStatus = currentStatus !== SKILL_STATUS.ATTAINED ? SKILL_STATUS.ATTAINED : null;
    this.props.actions.updateSkillStatus(this.evaluationId, skillGroupId, id, newStatus);
  };

  evaluationComplete(evaluationId) {
    this.props.actions.evaluationComplete(evaluationId);
  }

  render() {
    return (
      <div>
        <Row>
          <Col md={6}>
          <h2>{this.props.params.category}</h2>
          </Col>
        </Row>
        <Row className="show-grid">
          <Col md={6}>
            <Skill
              level={this.skillGroups[this.state.currentSkill.skillGroupId].level}
              skill={this.skills[this.state.currentSkill.id]}
              updateSkillStatus={this.updateSkillStatus}
              nextSkill={this.nextSkill}
              prevSkill={this.prevSkill}
              isFirstSkill={this.state.indexOfCurrentSkill === 0}
              isLastSkill={this.state.indexOfCurrentSkill + 1 === this.state.allSkillsInCategory.length}
            />
            <ButtonGroup
              className='pull-right'
            >
            <Link to={`evaluations/${this.evaluationId}/category/${this.categories[this.state.indexOfCurrentCategory - 1]}`}
                  className={'category-nav-link'}>
              <Button
                bsSize='large'
                disabled={this.state.indexOfCurrentCategory === 0}
              >
                <Glyphicon glyph='chevron-left'/>
                Previous category
              </Button>
            </Link>
              <Link to={`evaluations/${this.evaluationId}/category/${this.categories[this.state.indexOfCurrentCategory + 1]}`}
                  className={'category-nav-link'}>
              <Button
                bsSize='large'
                disabled={this.state.indexOfCurrentCategory + 1 === this.categories.length}
              >
                Next category
                <Glyphicon glyph='chevron-right'/>
              </Button>
            </Link>
            </ButtonGroup>
          </Col>
          <Col md={6}>
            <Link to={`evaluations/${this.evaluationId}`}>
              <Button
                bsStyle='success'
                bsSize='large'
                onClick={() => this.evaluationComplete(this.evaluationId)}
              >
                {"I've finished my evaluation"}
              </Button>
            </Link>
            <Matrix
              head={false}
              currentSkill={this.state.currentSkill.id}
              categories={[].concat(this.props.params.category)}
              levels={[].concat(this.levels)}
              skillGroups={this.skillGroups}
              skills={this.skills}
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
