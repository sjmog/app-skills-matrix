import * as React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import * as moment from 'moment';
import CopyToClipboard from 'react-copy-to-clipboard';
import './actionList.scss';

type ActionsListProps = {
  actions: any,
  viewSkillDetails?: (skill: any) => void,
};

const ActionsList = ({ actions, viewSkillDetails }: ActionsListProps) =>
  (
    <div>
      {
        actions.map(
          ({ createdDate, actions }) =>
            (<div key={createdDate}>
              <h2>{moment(createdDate).format('MMM Do YYYY')}</h2>
              <ListGroup>
                {
                  actions.map(({ skill }) =>
                    (<ListGroupItem key={skill.name}>
                      {skill.name}
                      {viewSkillDetails ? (
                        <button className={'btn btn-default btn-modal'} onClick={() => viewSkillDetails(skill)}>Details</button>) : ''}
                      <CopyToClipboard text={skill.name}>
                        <button className={'btn btn-default btn-copy'} />
                      </CopyToClipboard>
                    </ListGroupItem>),
                  )
                }
              </ListGroup>
            </div>),
        )
      }
    </div>
  );

export default ActionsList;
