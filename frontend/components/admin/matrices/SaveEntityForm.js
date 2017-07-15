import React, { PropTypes } from 'react';
import { Row, Form, FormGroup, ControlLabel, FormControl, Button, Glyphicon, Alert } from 'react-bootstrap';

const SaveEntityForm = ({ entityName, entity, saveEntity, updateEntityInLocalState, success, error }) =>
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

SaveEntityForm.propTypes = {
  entityName: PropTypes.string.isRequired,
  entity: PropTypes.string,
  saveEntity: PropTypes.func.isRequired,
  updateEntityInLocalState: PropTypes.func.isRequired,
  success: PropTypes.bool,
  error: PropTypes.object,
};

export default SaveEntityForm;
