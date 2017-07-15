import React, { PropTypes } from 'react';
import { Row } from 'react-bootstrap';

const TemplatePageHeader = ({ templateName }) => (
  <Row>
    <h3 className="header">{templateName}</h3>
  </Row>
);

TemplatePageHeader.propTypes = {
  templateName: PropTypes.string.isRequired,
};

export default TemplatePageHeader;
