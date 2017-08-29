import * as React from 'react';
import { Grid, Row } from 'react-bootstrap';
import { connect } from 'react-redux';

import { SaveTemplate } from './SaveTemplate';
import { SaveSkill } from './SaveSkill';
import TemplateList from './TemplateList';

type ManageMatricesPageComponentProps = {
  templates: TemplateViewModel[],
};

export const ManageMatricesPageComponent = ({ templates }: ManageMatricesPageComponentProps) =>
  (
    <Grid>
      <Row><h1 className="header">Matrices</h1></Row>
      <TemplateList
        templates={templates}
      />
      <SaveTemplate />
      <SaveSkill />
    </Grid>
  );

export const ManageMatricesPage = connect(
  state => state.matrices,
)(ManageMatricesPageComponent);
