import React, { PropTypes } from 'react';
import { Row, Table } from 'react-bootstrap';

const templateDetailsRow = (template) => {
  const { id, name } = template;
  return (
    <tr key={id}>
      <td>{name}</td>
    </tr>)
};

const TemplateList = ({ templates }) =>
  (
    <Row>
      <Table responsive bordered>
        <thead>
        <tr>
          <th>Name</th>
        </tr>
        </thead>
        <tbody>
        { templates.map(template => templateDetailsRow(template)) }
        </tbody>
      </Table>
    </Row>
  );

TemplateList.propTypes = {
  templates: PropTypes.array.isRequired,
};

export default TemplateList
