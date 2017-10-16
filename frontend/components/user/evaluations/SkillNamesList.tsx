import * as React from 'react';
import { connect } from 'react-redux';

import * as selectors from '../../../modules/user';

type SkillNamesListProps = {
  skillUids: string[],
  skillNames: string[],
};

const SkillNamesList = ({ skillNames }: SkillNamesListProps) => (
  <ul>{skillNames.map((name => <li key={name}>{name}</li>))}</ul>
);

export default connect(
  (state, props) => ({
    skillNames: selectors.getSkillNames(state, props.skillUids),
  }),
)(SkillNamesList);
