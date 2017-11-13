import * as React from 'react';
import * as R from 'ramda';
import { Table } from 'react-bootstrap';
import * as keymirror from 'keymirror';

import Level from './Level';
import SkillDetailsModal from './SkillDetailsModal';
import AddExistingSkillModal from './AddExistingSkillModal';

import '../../common/matrix.scss';

type MatrixProps = {
  categories: string[],
  levels: string[],
  skillGroups: NormalizedSkillGroups,
  skills: UnhydratedTemplateSkill[],
  onModifySkill: (skill: UnhydratedTemplateSkill) => void,
  onReplaceSkill: (level: string, category: string, skill: UnhydratedTemplateSkill) => void,
  onRemoveSkill: (level: string, category: string, skill: UnhydratedTemplateSkill) => void,
  onAddSkill: (level: string, category: string, existingSkillId?: string) => void,
};

type MatrixState = {
  showModal: null | string,
  skill: UnhydratedTemplateSkill,
  level: string,
  category: string,
};

const modals = keymirror({
  EDIT_SKILL: null,
  ADD_EXISTING_SKILL: null,
});

class Matrix extends React.Component<MatrixProps, MatrixState> {
  constructor(props) {
    super(props);

    this.state = {
      showModal: null,
      skill: null,
      level: null,
      category: null,
    };

    this.viewSkillDetails = this.viewSkillDetails.bind(this);
    this.viewAddExistingSkill = this.viewAddExistingSkill.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  viewSkillDetails(level, category, skill) {
    this.setState({
      showModal: modals.EDIT_SKILL,
      skill: R.clone(skill),
      level,
      category,
    });
  }

  viewAddExistingSkill(level, category) {
    this.setState({
      showModal: modals.ADD_EXISTING_SKILL,
      level,
      category,
    });
  }

  closeModal() {
    this.setState({
      showModal: null,
      skill: null,
      level: null,
      category: null,
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
            {categories.map(categoryName => (<th className="matrix__col-heading" key={categoryName}>{categoryName}</th>))}
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
                viewAddExistingSkill={this.viewAddExistingSkill}
                onAddSkill={onAddSkill}
              />
            ))
          }
          </tbody>
        </Table>
        <SkillDetailsModal
          showModal={this.state.showModal === modals.EDIT_SKILL}
          onClose={this.closeModal}
          skill={this.state.skill}
          level={this.state.level}
          category={this.state.category}
          onModifySkill={this.props.onModifySkill}
          onReplaceSkill={this.props.onReplaceSkill}
          onRemoveSkill={this.props.onRemoveSkill}
        />
        <AddExistingSkillModal
          showModal={this.state.showModal === modals.ADD_EXISTING_SKILL}
          closeModal={this.closeModal}
          level={this.state.level}
          category={this.state.category}
          onAddSkill={onAddSkill}
        />
      </div>
    );
  }
}

export default Matrix;
