import * as React from 'react';
import { Row, Table } from 'react-bootstrap';
import { Link } from 'react-router';

const templateDetailsRow = (template: TemplateViewModel) => {
  const { id, name } = template;
  return (
    <tr key={id}>
      <td>{name}</td>
      <td>
        <Link to={{
          pathname: `/admin/matrices/templates/${id}`,
        }}
        >
          Modify
        </Link>
      </td>
    </tr>);
};

const TemplateList = ({ templates }: { templates: TemplateViewModel[]}) =>
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

export default TemplateList;
