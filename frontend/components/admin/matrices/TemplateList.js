import React, { PropTypes } from 'react';
import { Row, Table } from 'react-bootstrap';
import { Link } from 'react-router';

const templateDetailsRow = (template) => {
  const { id, name } = template;
  return (
    <tr key={id}>
      <td>{name}</td>
      <td>
        <Link to={{
          pathname: `/admin/matrices/templates/${id}`,
          state: { template },
        }}
        >
          Modify
        </Link>
      </td>
    </tr>);
};

const TemplateList = ({ templates }) =>
  (
    <Row>
      <Table responsive bordered>
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
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

export default TemplateList;
