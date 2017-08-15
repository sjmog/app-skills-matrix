import * as React from 'react';
import { Row, Form, FormGroup, ControlLabel, FormControl, Button, Glyphicon, Alert } from 'react-bootstrap';

type SaveEntityFormProps = {
  entityName: string,
  entity?: string,
  saveEntity: (e: any) => void,
  updateEntityInLocalState: (e: any) => void,
  success: boolean,
  error?: ErrorMessage,
};

const SaveEntityForm = ({ entityName, entity, saveEntity, updateEntityInLocalState, success, error }: SaveEntityFormProps) =>
  (
    <div>
      <Row className="show-grid">
        <Form onSubmit={saveEntity}>
          <FormGroup>
            <ControlLabel>Paste your JSON here</ControlLabel>
            <FormControl
              componentClass="textarea"
              name={entityName}
              value={entity || ''}
              onChange={updateEntityInLocalState}
            />
          </FormGroup>
          {' '}
          <Button bsStyle="primary" type="submit"><Glyphicon glyph="upload" /></Button>
        </Form>
      </Row>
      <Row>
        { success ? <Alert bsStyle="success">{`${entityName}(s) successfully saved`}</Alert> : false }
      </Row>
      <Row>
        { error ? <Alert bsStyle="danger">Something went wrong: {error.message}</Alert> : false }
      </Row>
    </div>
  );

export default SaveEntityForm;
