import * as React from 'react';
import { connect } from 'react-redux';
import { ListGroupItem } from 'react-bootstrap';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import * as selectors from '../../../modules/user';

type ActionItemProps = {
  skillUid: string,
  skill: UnhydratedEvaluationSkill,
  viewSkillDetails: (skillUid: string) => void,
};

class ActionItem extends React.Component<ActionItemProps> {
  render() {
    const { skillUid, skill: { name }, viewSkillDetails } = this.props;
    return (
      <ListGroupItem key={skillUid}>
        {name}
        {
          viewSkillDetails
            ? <button className={'btn btn-default btn-modal'} onClick={() => viewSkillDetails(skillUid)}>Details</button>
            : false
        }
        <CopyToClipboard text={name}>
          <button className="btn btn-default btn-copy" />
        </CopyToClipboard>
      </ListGroupItem>
    );
  }
}

export default connect(
  (state, { skillUid }) => ({
    skill: selectors.getSkill(state, skillUid),
  }),
)(ActionItem);
