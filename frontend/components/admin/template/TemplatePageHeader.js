import React, { PropTypes } from 'react';
import { Row } from 'react-bootstrap';
import './template.scss'

const TemplatePageHeader = ({ templateName, firstCategory, id } ) => (
  <Row>
    <h3 className='header'>{templateName}</h3>
  </Row>
);

TemplatePageHeader.propTypes = {
  templateName: PropTypes.string.isRequired,
  firstCategory: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default TemplatePageHeader;
