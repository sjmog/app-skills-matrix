import * as React from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';

import MatricesActions from './MatricesActions';
import TemplateList from './TemplateList';

type ManageMatricesPageComponentProps = {
  templates: TemplateViewModel[],
};

export const ManageMatricesPageComponent = ({ templates }: ManageMatricesPageComponentProps) =>
  (
    <Grid>
      <Row>
        <Col md={6}>
          <TemplateList templates={templates}/>
        </Col>
        <Col md={6}>
          <MatricesActions />
        </Col>
      </Row>
    </Grid>
  );

export const ManageMatricesPage = connect(
  state => state.matrices,
)(ManageMatricesPageComponent);
