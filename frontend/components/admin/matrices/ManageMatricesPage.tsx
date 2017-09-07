import * as React from 'react';
import { Accordion, Grid, Panel, Row } from 'react-bootstrap';
import { connect } from 'react-redux';

import { SaveTemplate } from './SaveTemplate';
import { SaveSkill } from './SaveSkill';
import { NewTemplate } from './NewTemplate';
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
      <Accordion>
        <Panel header="New Template" eventKey="1">
          <NewTemplate />
        </Panel>
        <Panel header="Import Template" eventKey="2">
          <SaveTemplate />
        </Panel>
        <Panel header="Import Skills" eventKey="3">
          <SaveSkill />
        </Panel>
      </Accordion>
    </Grid>
  );

export const ManageMatricesPage = connect(
  state => state.matrices,
)(ManageMatricesPageComponent);
