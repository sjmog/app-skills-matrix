import * as React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import * as CopyToClipboard from 'react-copy-to-clipboard';

import '../../common/actionList.scss';

type ActionsListProps = {
  actions: any,
  viewSkillDetails?: (skill: any) => void,
};

// TODO: Different views for admin & mentor?
// TODO: Add evaluation date
// TODO: PR comment - can we remove actions all together?

const ActionsList = ({ actions, viewSkillDetails }: ActionsListProps) =>
  (
    <ListGroup>
      {
        actions.map(({ name, uid }) => (
          <ListGroupItem key={uid}>
            {name}
            {
              viewSkillDetails
                ? <button className={'btn btn-default btn-modal'} onClick={() => viewSkillDetails(uid)}>Details</button>
                : false
            }
            <CopyToClipboard text={name}><button className={'btn btn-default btn-copy'}/></CopyToClipboard>
          </ListGroupItem>
        ))
      }
    </ListGroup>
  );

export default ActionsList;
