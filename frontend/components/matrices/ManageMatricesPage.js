import React, { PropTypes } from 'react';
import { Row } from 'react-bootstrap';

import { AddTemplate } from './AddTemplate';
import { AddSkill } from './AddSkill';

const ManageMatricesPage = () => {
 return (
   <div>
     <Row>
       <h1 className="header">Matrices</h1>
     </Row>
     <AddTemplate />
     <AddSkill />
  </div>
 )
};

export default ManageMatricesPage;
