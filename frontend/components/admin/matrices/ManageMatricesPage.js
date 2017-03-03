import React, { PropTypes } from 'react';
import { Row } from 'react-bootstrap';

import { SaveTemplate } from './SaveTemplate';
import { SaveSkill } from './SaveSkill';

export const ManageMatricesPage = () =>
 (
   <div>
     <Row><h1 className="header">Matrices</h1></Row>
     <SaveTemplate />
     <SaveSkill />
    </div>
 );
