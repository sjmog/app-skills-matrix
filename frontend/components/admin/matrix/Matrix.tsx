import * as React from 'react';
import { Table } from 'react-bootstrap';

import Level from './Level';
import SkillDetailsModal from './SkillDetailsModal';

import '../../common/matrix.scss';

type MatrixProps = {
  categories: string[],
  levels: string[],
  skillGroups: any,
  skills: UnhydratedTemplateSkill[],
};

class Matrix extends React.Component<MatrixProps, { showModal: boolean, currentSkill: UnhydratedTemplateSkill }> {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      currentSkill: null,
    };

    this.viewSkillDetails = this.viewSkillDetails.bind(this);
    this.hideSkillDetails = this.hideSkillDetails.bind(this);
  }

  viewSkillDetails(skill) {
    this.setState({
      showModal: true,
      currentSkill: skill,
    });
  }

  hideSkillDetails() {
    this.setState({
      currentSkill: null,
      showModal: false,
    });
  }

  render() {
    const { categories, levels, skillGroups, skills } = this.props;
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
              />
            ))
          }
          </tbody>
        </Table>
        <SkillDetailsModal
          showModal={this.state.showModal}
          onClose={this.hideSkillDetails}
          skill={this.state.currentSkill && skills[this.state.currentSkill.id]}
          onModifySkill={() => {}}
        />
      </div>
    );
  }
}

export default Matrix;
