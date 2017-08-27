import * as React from 'react';
import { Table } from 'react-bootstrap';

import Level from './Level';
import SkillDetailsModal from './SkillDetailsModal';

import '../../common/matrix.scss';

type MatrixProps = {
  evaluationId: string,
  categories: string[],
  levels: string[],
  skillGroups: any,
  canUpdateSkillStatus: boolean,
  updateSkillStatus: (skillId: number, newSkillStatus: string, skillUid: string) => void,
};

class Matrix extends React.Component<MatrixProps, any> {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
    };

    this.viewSkillDetails = this.viewSkillDetails.bind(this);
    this.hideSkillDetails = this.hideSkillDetails.bind(this);
  }

  viewSkillDetails(skillUid) {
    this.setState({
      showModal: true,
      currentSkill: skillUid,
    });
  }

  hideSkillDetails() {
    this.setState({
      currentSkill: null,
      showModal: false,
    });
  }

  render() {
    const { evaluationId, categories, levels, skillGroups, updateSkillStatus, canUpdateSkillStatus } = this.props;
    return (
      <div>
        <Table responsive>
          <thead className="matrix-table__head">
            <tr>
              <th>{' '}</th>
              { categories.map(categoryName => (<th key={categoryName}>{categoryName}</th>)) }
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
                  viewSkillDetails={this.viewSkillDetails}
                />
              ))
            }
          </tbody>
        </Table>
        <SkillDetailsModal
          evaluationId={evaluationId}
          skillUid={this.state.currentSkill}
          showModal={this.state.showModal}
          onClose={this.hideSkillDetails}
          updateSkillStatus={updateSkillStatus}
          canUpdateSkillStatus={canUpdateSkillStatus}
        />
      </div>
    );
  }
}

export default Matrix;
