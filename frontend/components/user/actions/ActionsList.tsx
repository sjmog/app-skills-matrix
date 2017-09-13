import * as React from 'react';
import { ListGroup } from 'react-bootstrap';
import ActionItem from './ActionItem';

import './actionList.scss';

type ActionsListProps = {
  actionSkillUids: string[],
  viewSkillDetails?: (skill: any) => void,
};

const ActionsList = ({ actionSkillUids, viewSkillDetails }: ActionsListProps) => (
  <ListGroup>
    {
      actionSkillUids.map(skillUid =>
        <ActionItem key={skillUid} skillUid={skillUid} viewSkillDetails={viewSkillDetails} />)
    }
  </ListGroup>
);

export default ActionsList;
