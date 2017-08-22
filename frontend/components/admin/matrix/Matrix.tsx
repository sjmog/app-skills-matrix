import * as React from 'react';
import * as R from 'ramda';
import { Table } from 'react-bootstrap';

import Level from './Level';
import SkillDetailsModal from './SkillDetailsModal';

import '../../common/matrix.scss';

type MatrixProps = {
  categories: string[],
  levels: string[],
  skillGroups: NormalizedSkillGroups,
  skills: UnhydratedTemplateSkill[],
  onModifySkill: (skill: UnhydratedTemplateSkill) => void,
  onReplaceSkill: (level: string, category: string, skill: UnhydratedTemplateSkill) => void,
  onRemoveSkill: (level: string, category: string, skill: UnhydratedTemplateSkill) => void,
  onAddSkill: (level: string, category: string) => void,
};

type MatrixState = {
  showModal: boolean,
  currentSkill: {
    skill: UnhydratedTemplateSkill,
    level: string,
    category: string,
  },
};

class Matrix extends React.Component<MatrixProps, MatrixState> {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      currentSkill: null,
    };

    this.viewSkillDetails = this.viewSkillDetails.bind(this);
    this.hideSkillDetails = this.hideSkillDetails.bind(this);
  }

  viewSkillDetails(level, category, skill) {
    this.setState({
      showModal: true,
      currentSkill: {
        skill: R.clone(skill),
        level,
        category,
      },
    });
  }

  hideSkillDetails() {
    this.setState({
      currentSkill: null,
      showModal: false,
    });
  }

  render() {
    const { categories, levels, skillGroups, skills, onAddSkill } = this.props;
    return (
      <div>
        <Table responsive>
          <thead className="matrix-table__head">
          <tr>
            <th>{' '}</th>
            {categories.map(categoryName => (<th key={categoryName}>{categoryName}</th>))}
          </tr>
          </thead>
          <tbody className="matrix-table__body">
          {
            levels.map(levelName => (
              <Level
                key={levelName}
                categories={categories}
                levelName={levelName}
                skillGroups={skillGroups}
                skills={skills}
                viewSkillDetails={this.viewSkillDetails}
                onAddSkill={onAddSkill}
              />
            ))
          }
          </tbody>
        </Table>
        <SkillDetailsModal
          showModal={this.state.showModal}
          onClose={this.hideSkillDetails}
          skill={this.state.currentSkill && this.state.currentSkill.skill}
          level={this.state.currentSkill && this.state.currentSkill.level}
          category={this.state.currentSkill && this.state.currentSkill.category}
          onModifySkill={this.props.onModifySkill}
          onReplaceSkill={this.props.onReplaceSkill}
          onRemoveSkill={this.props.onRemoveSkill}
        />
      </div>
    );
  }
}

export default Matrix;
