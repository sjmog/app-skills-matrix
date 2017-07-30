import React, { PropTypes } from 'react';
import { Table } from 'react-bootstrap';

import Level from './Level';
import SkillDetailsModal from './SkillDetailsModal';

import '../../common/matrix/matrix.scss';

class Matrix extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
    };

    this.viewSkillDetails = this.viewSkillDetails.bind(this);
    this.hideSkillDetails = this.hideSkillDetails.bind(this);
  }

  viewSkillDetails(skillId) {
    this.setState({
      showModal: true,
      currentSkill: skillId,
    });
  }

  hideSkillDetails() {
    this.setState({
      currentSkill: null,
      showModal: false,
    });
  }

  render() {
    const { categories, levels, skillGroups, skillBeingEvaluated, updateSkillStatus, canUpdateSkillStatus } = this.props;
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
                  skillBeingEvaluated={skillBeingEvaluated}
                />
              ))
            }
          </tbody>
        </Table>
        <SkillDetailsModal
          skillId={this.state.currentSkill}
          showModal={this.state.showModal}
          onClose={this.hideSkillDetails}
          updateSkillStatus={updateSkillStatus}
          canUpdateSkillStatus={canUpdateSkillStatus}
        />
      </div>
    );
  }
}

Matrix.propTypes = {
  categories: PropTypes.array.isRequired,
  levels: PropTypes.array.isRequired,
  skillGroups: PropTypes.object.isRequired,
  skillBeingEvaluated: PropTypes.string,
  canUpdateSkillStatus: PropTypes.bool,
};

export default Matrix;
