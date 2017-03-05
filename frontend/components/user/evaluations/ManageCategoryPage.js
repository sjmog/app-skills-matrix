import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions } from '../../../modules/user/manageEvaluation';
import { getSkillGroup } from './helpers';

import AdditionalInfo from './AdditionalInfo';
import CategoryNav from './CategoryNav';
import SkillGroup from './SkillGroup';

class ManageCategoryComponent extends React.Component {
  constructor(props) {
    super(props);

    this.updateSkillStatus = this.updateSkillStatus.bind(this);
  }

  updateSkillStatus(skillId, status) {
    this.props.actions.updateSkillStatus(skillId, status);
  };

  render() {
    const { category: currentCategory } = this.props.params;
    const { template, skillGroups, skills } = this.props;

    return (
      <div>
        <h2>{currentCategory}</h2>
        {
          template.levels.map((level, index) => {
            const { skills: skillsInGroup } = getSkillGroup(level, currentCategory, skillGroups);

            return (
              <SkillGroup
                key={index}
                eventKey={index}
                level={level}
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
          evaluation={this.props.params.evaluationId}
        />
      </div>
    )
  }
}

ManageCategoryComponent.propTypes = {
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

export const ManageCategoryPage = connect(
  function mapStateToProps(state) {
    return state.manageEvaluation;
  },
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(actions, dispatch)
    };
  }
)(ManageCategoryComponent);
