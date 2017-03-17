import React, { PropTypes } from 'react';
import { Row } from 'react-bootstrap';
import { connect } from 'react-redux';

import { SaveTemplate } from './SaveTemplate';
import { SaveSkill } from './SaveSkill';
import TemplateList from './TemplateList';

export const ManageMatricesPageComponent = ({ templates }) =>
  (
    <div>
      <Row><h1 className="header">Matrices</h1></Row>
      <TemplateList
        templates={templates}/>
      <SaveTemplate />
      <SaveSkill />
    </div>
  );

export const ManageMatricesPage = connect(
  function mapStateToProps(state) {
    return state.matrices;
  }
)(ManageMatricesPageComponent);
