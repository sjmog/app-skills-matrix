import * as React from 'react';
import { Row } from 'react-bootstrap';

const TemplatePageHeader = ({ templateName }: { templateName: string }) => (
  <Row>
    <h3 className="header">{templateName}</h3>
  </Row>
);

export default TemplatePageHeader;
