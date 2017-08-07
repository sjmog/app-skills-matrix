import * as React from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';

type SkillDetailsModalProps = {
  showModal: boolean,
  onClose: (e:any) => void,
  skill: any,
};

const SkillDetailsModal = ({ showModal, onClose, skill }: SkillDetailsModalProps) => (
  <div>
    <Modal show={showModal} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Skill Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        { skill
            ? <div>
              <dl>
                <dt>id</dt>
                <dd>{skill.id}</dd>
                <dt>name</dt>
                <dd>{skill.name}</dd>
                <dt>criteria</dt>
                <dd>{skill.criteria ? skill.criteria : '-'}</dd>
                <dt>type</dt>
                <dd>{skill.type ? skill.type : '-'}</dd>
                <dt>version</dt>
                <dd>{skill.version ? skill.version : '-'}</dd>
                <dt>questions</dt>
                <dd>
                  {skill.questions ? <ul>{skill.questions.map(({ title }) => <li key={title}>{title}</li>)}</ul> : '-'}
                </dd>
              </dl>
              { skill.error ? <Alert bsStyle="danger">Something went wrong: {skill.error.message}</Alert> : false }
            </div>
            : null
          }
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  </div>
  );

export default SkillDetailsModal;
