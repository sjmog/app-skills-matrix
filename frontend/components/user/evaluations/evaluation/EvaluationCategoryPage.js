import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, SKILL_STATUS } from '../../../../modules/user/evaluation';
import { getSkillGroup } from '../../../common/helpers';

import CategoryNav from './CategoryNav';
import SkillGroup from './SkillGroup';

class EvaluationCategoryComponent extends React.Component {
  constructor(props) {
    super(props);

    this.updateSkillStatus = this.updateSkillStatus.bind(this);
    this.evaluationComplete = this.evaluationComplete.bind(this);
  }

  updateSkillStatus(evaluationId, skillGroupId, skillId, currentStatus) {
    const newStatus = currentStatus !== SKILL_STATUS.ATTAINED ? SKILL_STATUS.ATTAINED : null;
    this.props.actions.updateSkillStatus(evaluationId, skillGroupId, skillId, newStatus);
  };

  evaluationComplete(evaluationId) {
    this.props.actions.evaluationComplete(evaluationId);
  }

  render() {
    const { category: currentCategory, evaluationId } = this.props.params;
    const { template, skillGroups, skills } = this.props;

    return (
      <div>
        <h2>{currentCategory}</h2>
        {
          template.levels.map((level) => {
            const { id: skillGroupId, skills: skillsInGroup } = getSkillGroup(level, currentCategory, skillGroups);

            return (
              <SkillGroup
                evaluationId={evaluationId}
                key={skillGroupId}
                eventKey={skillGroupId}
                level={level}
                skillGroupId={skillGroupId}
                skillsInGroup={skillsInGroup}
                skills={skills}
                updateSkillStatus={this.updateSkillStatus}
              />
            )
          })
        }
        <CategoryNav
          categories={template.categories}
          currentCategory={currentCategory}
          evaluation={evaluationId}
          evaluationComplete={this.evaluationComplete}
        />
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
